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
  const processModelKey = 'test_consumer_api_correlation_result';

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
    const returnOn = startCallbackType.CallbackOnEndEventReached;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

    should(result).have.property('correlationId');
    should(result.correlationId).be.equal(payload.correlationId);

    return result.correlationId;
  }

  it('should successfully return the results for the given correlationId', async () => {

    const correlationResult = await testFixtureProvider
      .consumerApiClientService
      .getProcessResultForCorrelation(consumerContext, correlationId, processModelKey);

    should.exist(correlationResult);
    should(correlationResult).have.property('scriptOutput');
    should(correlationResult.scriptOutput).be.match(/hello world/i);
  });

  it('should fail to get the results, when the user is unauthorized', async () => {

    try {
      const results = await testFixtureProvider
        .consumerApiClientService
        .getProcessResultForCorrelation({}, correlationId, processModelKey);

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

  it('should fail to get the results, if the given correlationId does not exist', async () => {

    const invalidCorrelationId = 'invalidCorrelationId';

    try {
      const results = await testFixtureProvider
        .consumerApiClientService
        .getProcessResultForCorrelation(consumerContext, invalidCorrelationId, processModelKey);

      should.fail(results, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /No.*?process.*?within correlation.*?found/i;
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
      const expectedErrorMessage = /No.*?process.*?within correlation.*?found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

});
