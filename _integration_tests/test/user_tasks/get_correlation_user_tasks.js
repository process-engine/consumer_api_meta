'use strict';

const should = require('should');
const uuid = require('uuid');

const StartCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   GET  ->  /correlations/:correlation_id/user_tasks', function getUserTasksForCorrelation() {

  let testFixtureProvider;
  let consumerContext;
  let correlationId;
  const processModelId = 'consumer_api_usertask_test';

  this.timeout(testTimeoutMilliseconds);

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    consumerContext = testFixtureProvider.context.defaultUser;
    await startProcessInstance();
  });

  after(async () => {
    // TODO - BUG:
    // After receiving a 403 error, running any further requests will result in a 403 error aswell.
    // Cleanup will not work, after the last test for checking the users access to a process model is done.
    // await finishWaitingUserTasksAfterTests();
    await testFixtureProvider.tearDown();
  });

  async function startProcessInstance() {
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelId, startEventKey, payload, startCallbackType);

    correlationId = result.correlationId;

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }

  async function finishWaitingUserTasksAfterTests() {
    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      formFields: {
        Form_XGSVBgio: true,
      },
    };

    await testFixtureProvider
      .consumerApiClientService
      .finishUserTask(consumerContext, processModelId, correlationId, userTaskId, userTaskResult);
  }

  it('should return a correlation\'s user tasks by its correlationId through the consumer api', async () => {

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

  it('should fail to retrieve the correlation\'s user tasks, if the correlationId does not exist', async () => {

    const invalidCorrelationId = 'invalidCorrelationId';

    try {
      const processModel = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForCorrelation(consumerContext, invalidCorrelationId);

      should.fail(processModel, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /no correlation.*?found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the correlation\'s user tasks, when the user is unauthorized', async () => {

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

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForCorrelation(restrictedContext, correlationId);

      should.fail(userTaskList, undefined, 'This request should have failed!');
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
