'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

const testCase = 'GET  ->  /process_models/:process_model_key/correlations/:correlation_id/user_tasks';
describe(`Consumer API: ${testCase}`, function getUserTasksForProcessModelInCorrelation() {

  let testFixtureProvider;
  let consumerContext;

  this.timeout(testTimeoutMilliseconds);

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    consumerContext = testFixtureProvider.context.defaultUser;
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  async function startProcessAndReturnCorrelationId(processModelKey) {
    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, 'StartEvent_0yfvdj3');

    return result.correlation_id;
  }

  it('should return a list of user tasks for a given process model in a given correlation', async () => {

    const processModelKey = 'consumer_api_lane_test';
    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    const userTaskList = await testFixtureProvider
      .consumerApiClientService
      .getUserTasksForProcessModelInCorrelation(consumerContext, processModelKey, correlationId);

    should(userTaskList).have.property('user_tasks');

    should(userTaskList.user_tasks).be.instanceOf(Array);
    should(userTaskList.user_tasks.length).be.greaterThan(0);

    userTaskList.user_tasks.forEach((userTask) => {
      should(userTask).have.property('key');
      should(userTask).have.property('id');
      should(userTask).have.property('process_instance_id');
      should(userTask).have.property('data');
    });
  });

  it('should fail to retrieve the correlation\'s user tasks, when the user is unauthorized', async () => {

    const processModelKey = 'consumer_api_lane_test';
    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForProcessModelInCorrelation({}, processModelKey, correlationId);

      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the correlation\'s user tasks, when the user forbidden to retrieve it', async () => {

    const processModelKey = 'consumer_api_lane_test';
    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForProcessModelInCorrelation(restrictedContext, processModelKey, correlationId);

      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve a list of user tasks, if the process_model_key does not exist', async () => {

    const invalidProcessModelKey = 'invalidProcessModelKey';
    const processModelKey = 'consumer_api_lane_test';
    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForProcessModelInCorrelation(consumerContext, invalidProcessModelKey, correlationId);

      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not part of/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve a list of user tasks, if the correlation_id does not exist', async () => {

    const processModelKey = 'consumer_api_lane_test';
    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    const invalidCorrelationId = 'invalidCorrelationId';

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForProcessModelInCorrelation(consumerContext, processModelKey, invalidCorrelationId);

      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

});