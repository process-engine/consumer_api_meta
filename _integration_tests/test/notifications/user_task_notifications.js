'use strict';

const should = require('should');
const uuid = require('uuid');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;
const ProcessInstanceHandler = require('../../dist/commonjs').ProcessInstanceHandler;

describe('Consumer API:   Receive User Task Notifications', () => {

  let processInstanceHandler;
  let testFixtureProvider;

  let consumerContext;
  const correlationId = uuid.v4();

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

  async function finishWaitingUserTask() {
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

    return new Promise(async (resolve, reject) => {

      const messageReceivedCallback = async (userTaskWaitingMessage) => {
        should.exist(userTaskWaitingMessage);

        const userTaskList = await testFixtureProvider
          .consumerApiClientService
          .getUserTasksForProcessModel(consumerContext, processModelId);

        const listContainsUserTaskIdFromMessage = userTaskList.userTasks.some((userTask) => {
          return userTask.id === userTaskWaitingMessage.userTaskId;
        });

        should(listContainsUserTaskIdFromMessage).be.true();

        await finishWaitingUserTask();

        resolve();
      };

      testFixtureProvider.consumerApiClientService.onUserTaskWaiting(messageReceivedCallback);

      await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelId);
    });
  });

  it('should send a notification via socket when user task is finished', async () => {

    return new Promise(async (resolve, reject) => {

      const messageReceivedCallback = async (userTaskFinishedMessage) => {

        const userTaskListAfterFinish = await testFixtureProvider
          .consumerApiClientService
          .getUserTasksForProcessModel(consumerContext, processModelId);

        should(userTaskFinishedMessage).not.be.undefined();

        const finishedMessageReceivedForUserTaskThatWasWaiting = userTaskListAfterFinish.userTasks.some((userTask) => {
          return userTask.id === userTaskFinishedMessage.userTaskId;
        });

        should(finishedMessageReceivedForUserTaskThatWasWaiting).be.true();

        resolve();
      };

      testFixtureProvider.consumerApiClientService.onUserTaskFinished(messageReceivedCallback);

      await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelId);
      await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);

      finishWaitingUserTask();
    });
  });

});
