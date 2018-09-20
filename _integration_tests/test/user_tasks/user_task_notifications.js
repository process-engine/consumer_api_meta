'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;
const ProcessInstanceHandler = require('../../dist/commonjs').ProcessInstanceHandler;

describe.only('Consumer API:   Receive User Task Notifications', () => {

  let processInstanceHandler;
  let testFixtureProvider;

  let consumerContext;
  let correlationId;

  const processModelId = 'test_consumer_api_usertask';
  const processModelIdNoUserTasks = 'test_consumer_api_usertask_empty';

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    consumerContext = testFixtureProvider.context.defaultUser;

    const processModelsToImport = [
      processModelId,
      processModelIdNoUserTasks,
    ];

    await testFixtureProvider.importProcessFiles(processModelsToImport);

    processInstanceHandler = new ProcessInstanceHandler(testFixtureProvider);
  });

  after(async () => {
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

  it('should send a notification via socket when user task is suspended', async () => {

    correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelId);

    let userTaskWaitingMessage;

    testFixtureProvider.consumerApiClientService.onUserTaskWaiting((message) => {
      userTaskWaitingMessage = message;
    });

    await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);

    const userTaskList = await testFixtureProvider
      .consumerApiClientService
      .getUserTasksForProcessModel(consumerContext, processModelId);

    should(userTaskWaitingMessage).not.be.undefined();

    const listContainsUserTaskIdFromMessage = userTaskList.userTasks.some((userTask) => {
      return userTask.id === userTaskWaitingMessage.userTaskId;
    });

    should(listContainsUserTaskIdFromMessage).be.true();

    await finishWaitingUserTasksAfterTests();
  });

  it('should send a notification via socket when user task is finished', async () => {

    correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelId);

    let userTaskFinishedMessage;

    testFixtureProvider.consumerApiClientService.onUserTaskFinished((message) => {
      userTaskFinishedMessage = message;
    });

    await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);

    const userTaskListBeforeFinish = await testFixtureProvider
      .consumerApiClientService
      .getUserTasksForProcessModel(consumerContext, processModelId);

    await finishWaitingUserTasksAfterTests();

    const userTaskListAfterFinish = await testFixtureProvider
      .consumerApiClientService
      .getUserTasksForProcessModel(consumerContext, processModelId);

    should(userTaskFinishedMessage).not.be.undefined();

    const finishedMessageReceivedForUserTaskThatWasWaiting = userTaskListBeforeFinish.userTasks.some((userTask) => {
      return userTask.id === userTaskFinishedMessage.userTaskId;
    });

    should(finishedMessageReceivedForUserTaskThatWasWaiting).be.true();

    const userTaskListAfterFinishDoesNotContainUserTask = userTaskListAfterFinish.userTasks.length === 0;
    should(userTaskListAfterFinishDoesNotContainUserTask).be.true();

  });

});
