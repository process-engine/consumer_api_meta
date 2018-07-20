'use strict';

const should = require('should');
const uuid = require('uuid');

const startCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   GET  ->  /correlations/:correlation_id/process_models/:process_model_key/results', function startProcessInstance() {

  let testFixtureProvider;
  let consumerContext;
  let correlationId;
  const processModelId = 'test_consumer_api_correlation_result';

  this.timeout(testTimeoutMilliseconds);

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    consumerContext = testFixtureProvider.context.defaultUser;

    correlationId = await createFinishedProcessInstanceAndReturnCorrelationId();
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  async function createFinishedProcessInstanceAndReturnCorrelationId() {

    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };
    const returnOn = startCallbackType.CallbackOnProcessInstanceFinished;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelId, startEventKey, payload, returnOn);

    should(result).have.property('correlationId');
    should(result.correlationId).be.equal(payload.correlationId);

    return result.correlationId;
  }

  it('should successfully return the results for the given correlationId', async () => {

    const correlationResults = await testFixtureProvider
      .consumerApiClientService
      .getProcessResultForCorrelation(consumerContext, correlationId, processModelId);

    should(correlationResults).be.instanceof(Array);
    should(correlationResults.length).be.equal(1);

    const correlationResult = correlationResults[0];

    const expectedEndEventId = 'EndEvent_Success';
    const expectedTokenPayload = /hello world/i;

    should(correlationResult.correlationId).be.equal(correlationId);
    should(correlationResult.endEventId).be.equal(expectedEndEventId);
    should(correlationResult).have.property('tokenPayload');
    should(correlationResult.tokenPayload.scriptOutput).be.match(expectedTokenPayload);
  });

  it('should fail to get the results, if the given correlationId does not exist', async () => {

    const invalidCorrelationId = 'invalidCorrelationId';

    try {
      const results = await testFixtureProvider
        .consumerApiClientService
        .getProcessResultForCorrelation(consumerContext, invalidCorrelationId, processModelId);

      should.fail(results, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /no process results for correlation.*?found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to get the results, if the given process model key does not exist within the given correlation', async () => {

    const invalidProcessModelKey = 'invalidProcessmodelKey';

    try {
      const results = await testFixtureProvider
        .consumerApiClientService
        .getProcessResultForCorrelation(consumerContext, correlationId, invalidProcessModelKey);

      should.fail(results, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /process model.*?not found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to get the results, when the user is unauthorized', async () => {

    try {
      const results = await testFixtureProvider
        .consumerApiClientService
        .getProcessResultForCorrelation({}, correlationId, processModelId);

      should.fail(results, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to get the results, when the user is forbidden to see the process instance result', async () => {

    try {
      const results = await testFixtureProvider
        .consumerApiClientService
        .getProcessResultForCorrelation(testFixtureProvider.context.restrictedUser, correlationId, processModelId);

      should.fail(results, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

});
