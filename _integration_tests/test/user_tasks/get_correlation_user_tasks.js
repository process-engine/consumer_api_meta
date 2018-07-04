'use strict';

const should = require('should');
const uuid = require('uuid');

const StartCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   GET  ->  /correlations/:correlation_id/user_tasks', function getUserTasksForCorrelation() {

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
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

    return result.correlationId;
  }

  it('should return a correlation\'s user tasks by its correlationId through the consumer api', async () => {

    const processModelKey = 'consumer_api_usertask_test';
    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    const userTaskList = await testFixtureProvider
      .consumerApiClientService
      .getUserTasksForCorrelation(consumerContext, correlationId);

    should(userTaskList).have.property('userTasks');

    should(userTaskList.userTasks).be.instanceOf(Array);
    should(userTaskList.userTasks.length).be.greaterThan(0);

    userTaskList.userTasks.forEach((userTask) => {
      should(userTask).have.property('key');
      should(userTask).have.property('id');
      should(userTask).have.property('processInstanceId');
      should(userTask).have.property('data');
    });
  });

  it('should fail to retrieve the correlation\'s user tasks, when the user is unauthorized', async () => {

    const correlationId = 'test_consumer_api_process_start';

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForCorrelation({}, correlationId);

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

    const processModelKey = 'consumer_api_usertask_test';
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
        .getUserTasksForCorrelation(restrictedContext, correlationId);

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

  it('should fail to retrieve the correlation\'s user tasks, if the correlationId does not exist', async () => {

    const processModelKey = 'consumer_api_usertask_test';
    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    const invalidCorrelationId = 'invalidCorrelationId';

    try {
      const processModel = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForCorrelation(consumerContext, invalidCorrelationId);

      should.fail(processModel, undefined, 'This request should have failed!');
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
