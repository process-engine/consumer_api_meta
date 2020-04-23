'use strict';

const should = require('should');
const uuid = require('node-uuid');

const startCallbackType = require('@process-engine/consumer_api_contracts').DataModels.ProcessModels.StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;

describe('ConsumerAPI: GetProcessResultForCorrelation', () => {

  let testFixtureProvider;
  let defaultIdentity;
  let correlationId;

  const processModelIdDefault = 'test_consumer_api_correlation_result';
  const processModelIdMultipleEndEvents = 'test_consumer_api_correlation_multiple_results';

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    defaultIdentity = testFixtureProvider.identities.defaultUser;

    const processModelsToImport = [
      processModelIdDefault,
      processModelIdMultipleEndEvents,
    ];

    await testFixtureProvider.importProcessFiles(processModelsToImport);

    correlationId = await createFinishedProcessInstanceAndReturnCorrelationId();
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  async function createFinishedProcessInstanceAndReturnCorrelationId(processModelId = processModelIdDefault, endEventId = undefined) {

    const startEventId = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };

    let returnOn = startCallbackType.CallbackOnProcessInstanceFinished;

    if (endEventId) {
      returnOn = startCallbackType.CallbackOnEndEventReached;
    }

    const result = await testFixtureProvider
      .consumerApiClient
      .startProcessInstance(defaultIdentity, processModelId, payload, returnOn, startEventId, endEventId);

    should(result).have.property('correlationId');
    should(result.correlationId).be.equal(payload.correlationId);

    return result.correlationId;
  }

  it('should successfully return the results for the given correlationId', async () => {

    const results = await testFixtureProvider
      .consumerApiClient
      .getProcessResultForCorrelation(defaultIdentity, correlationId, processModelIdDefault);

    should(results).have.a.property('correlationResults');

    const correlationResults = results.correlationResults;

    should(correlationResults).be.an.Array();
    should(correlationResults).have.a.lengthOf(1);

    const correlationResult = correlationResults[0];

    const expectedEndEventId = 'EndEvent_Success';
    const expectedTokenPayload = /hello world/i;

    should(correlationResult.correlationId).be.equal(correlationId);
    should(correlationResult.endEventId).be.equal(expectedEndEventId);
    should(correlationResult).have.property('tokenPayload');
    should(correlationResult.tokenPayload.scriptOutput).be.match(expectedTokenPayload);
  });

  it('should successfully return the results for a correlation where multiple end events have been reached', async () => {

    const endEventToWaitFor = 'EndEvent_2';

    const correlationIdMultipleResults =
      await createFinishedProcessInstanceAndReturnCorrelationId(processModelIdMultipleEndEvents, endEventToWaitFor);

    const results = await testFixtureProvider
      .consumerApiClient
      .getProcessResultForCorrelation(defaultIdentity, correlationIdMultipleResults, processModelIdMultipleEndEvents);

    should(results).have.a.property('correlationResults');

    const correlationResults = results.correlationResults;

    should(correlationResults).be.an.Array();
    should(correlationResults).have.a.lengthOf(2);

    const expectedResults = {
      EndEvent_1: {
        correlationId: correlationIdMultipleResults,
        endEventId: 'EndEvent_1',
        tokenPayload: 'first result',
      },
      EndEvent_2: {
        correlationId: correlationIdMultipleResults,
        endEventId: 'EndEvent_2',
        tokenPayload: 'second result',
      },
    };

    for (const correlationResult of correlationResults) {
      should(correlationResult).be.eql(expectedResults[correlationResult.endEventId]);
    }
  });

  it('should return an empty Array, if the given correlationId does not exist', async () => {

    const invalidCorrelationId = 'invalidCorrelationId';

    const results = await testFixtureProvider
      .consumerApiClient
      .getProcessResultForCorrelation(defaultIdentity, invalidCorrelationId, processModelIdDefault);

    should(results).have.a.property('correlationResults');

    const correlationResults = results.correlationResults;

    should(correlationResults).be.an.Array();
    should(correlationResults).be.empty();
  });

  it('should return an empty Array, if the given process model id does not exist within the given correlation', async () => {

    const invalidprocessModelId = 'invalidprocessModelId';

    const results = await testFixtureProvider
      .consumerApiClient
      .getProcessResultForCorrelation(defaultIdentity, correlationId, invalidprocessModelId);

    should(results).have.a.property('correlationResults');

    const correlationResults = results.correlationResults;

    should(correlationResults).be.an.Array();
    should(correlationResults).be.empty();
  });

  it('should fail to get the results, when the user is unauthorized', async () => {

    try {
      const results = await testFixtureProvider
        .consumerApiClient
        .getProcessResultForCorrelation({}, correlationId, processModelIdDefault);

      should.fail(results, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.message).be.match(expectedErrorMessage);
      should(error.code).be.match(expectedErrorCode);
    }
  });

  it('should fail to get the results, when the user is forbidden to see the process instance result', async () => {

    try {
      const results = await testFixtureProvider
        .consumerApiClient
        .getProcessResultForCorrelation(testFixtureProvider.identities.restrictedUser, correlationId, processModelIdDefault);

      should.fail(results, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;
      should(error.message).be.match(expectedErrorMessage);
      should(error.code).be.match(expectedErrorCode);
    }
  });

});
