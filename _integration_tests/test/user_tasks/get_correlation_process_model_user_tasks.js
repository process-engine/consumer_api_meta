'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;
const ProcessInstanceHandler = require('../../dist/commonjs').ProcessInstanceHandler;

const testTimeoutMilliseconds = 5000;

const testCase = 'GET  ->  /process_models/:process_model_key/correlations/:correlation_id/userTasks';
describe(`Consumer API: ${testCase}`, function getUserTasksForProcessModelInCorrelation() {

  let processInstanceHandler;
  let testFixtureProvider;

  let consumerContext;
  let correlationId;

  const processModelId = 'consumer_api_usertask_test';

  this.timeout(testTimeoutMilliseconds);

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    consumerContext = testFixtureProvider.context.defaultUser;

    processInstanceHandler = new ProcessInstanceHandler(testFixtureProvider);

    correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelId);
    await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);
  });

  after(async () => {
    await finishWaitingUserTasksAfterTests();
    await testFixtureProvider.tearDown();
  });

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

  it('should return a list of user tasks for a given process model in a given correlation', async () => {

    const userTaskList = await testFixtureProvider
      .consumerApiClientService
      .getUserTasksForProcessModelInCorrelation(consumerContext, processModelId, correlationId);

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

  it('should fail to retrieve a list of user tasks, if the process_model_key does not exist', async () => {

    const invalidProcessModelId = 'invalidProcessModelId';

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForProcessModelInCorrelation(consumerContext, invalidProcessModelId, correlationId);

      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /no process instance.*?found/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve a list of user tasks, if the correlationId does not exist', async () => {

    const invalidCorrelationId = 'invalidCorrelationId';

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForProcessModelInCorrelation(consumerContext, processModelId, invalidCorrelationId);

      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /no correlation.*?found/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the correlation\'s user tasks, when the user is unauthorized', async () => {

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForProcessModelInCorrelation({}, processModelId, correlationId);

      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the correlation\'s user tasks, when the user forbidden to retrieve it', async () => {

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForProcessModelInCorrelation(restrictedContext, processModelId, correlationId);

      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

});
