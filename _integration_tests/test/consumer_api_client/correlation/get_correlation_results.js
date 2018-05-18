'use strict';

const should = require('should');
const uuid = require('uuid');

const startCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   GET  ->  /correlations/:correlation_id/results', function startProcessInstance() {

  let testFixtureProvider;
  let consumerContext;
  let correlationId;

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

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {},
    };
    const returnOn = startCallbackType.CallbackOnEndEventReached;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.equal(payload.correlation_id);

    return result.correlation_id;
  }

  it('should successfully return the results for the given correlationId', async () => {

    const results = await testFixtureProvider
      .consumerApiClientService
      .getCorrelationResults(consumerContext, correlationId);

    should.exist(results);
    should(results.correlationId).be.equal(correlationId);
    should(results).have.property('processInstanceResults');
    should(results.processInstanceResults).be.an.Array();
    should(results.processInstanceResults.length).be.greaterThan(0);

    for (const processResult of results.processInstanceResults) {
      should(processResult).have.property('processInstanceId');
      should(processResult).have.property('processModelKey');
      should(processResult).have.property('result');
    }
  });

  it('should fail to get the results, when the user is unauthorized', async () => {

    try {
      const results = await testFixtureProvider
        .consumerApiClientService
        .getCorrelationResults({}, correlationId);

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

    const invalidProcessModelKey = 'invalidCorrelationId';

    try {
      const results = await testFixtureProvider
        .consumerApiClientService
        .getCorrelationResults(consumerContext, invalidProcessModelKey);

      should.fail(results, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /No.*?process instances with correlation id.*?found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

});
