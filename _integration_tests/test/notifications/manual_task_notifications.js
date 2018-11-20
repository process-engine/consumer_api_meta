'use strict';

const should = require('should');
const uuid = require('uuid');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;
const ProcessInstanceHandler = require('../../dist/commonjs').ProcessInstanceHandler;

describe('Consumer API:   Receive Manual Task Notifications', () => {

  let processInstanceHandler;
  let testFixtureProvider;

  let defaultIdentity;

  const processModelId = 'test_consumer_api_manualtask';
  const processModelIdNoManualTasks = 'test_consumer_api_manualtask_empty';

  let manualTaskToFinish;

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    defaultIdentity = testFixtureProvider.identities.defaultUser;

    const processModelsToImport = [
      processModelId,
      processModelIdNoManualTasks,
    ];

    await testFixtureProvider.importProcessFiles(processModelsToImport);

    processInstanceHandler = new ProcessInstanceHandler(testFixtureProvider);
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  async function finishWaitingManualTask() {

    const correlationId = manualTaskToFinish.correlationId;
    const processInstanceId = manualTaskToFinish.processInstanceId;
    const manualTaskInstanceId = manualTaskToFinish.flowNodeInstanceId;

    await testFixtureProvider
      .consumerApiClientService
      .finishManualTask(defaultIdentity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  it('should send a notification via socket when ManualTask is suspended', async () => {

    const correlationId = uuid.v4();

    return new Promise(async (resolve, reject) => {

      const messageReceivedCallback = async (manualTaskWaitingMessage) => {

        should.exist(manualTaskWaitingMessage);
        manualTaskToFinish = manualTaskWaitingMessage;

        const manualTaskList = await testFixtureProvider
          .consumerApiClientService
          .getManualTasksForProcessModel(defaultIdentity, processModelId);

        const listContainsManualTaskIdFromMessage = manualTaskList.manualTasks.some((manualTask) => {
          return manualTask.id === manualTaskWaitingMessage.flowNodeId;
        });

        should(listContainsManualTaskIdFromMessage).be.true();

        resolve();
      };

      testFixtureProvider.consumerApiClientService.onManualTaskWaiting(defaultIdentity, messageReceivedCallback);

      await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelId, correlationId);
    });
  });

  it('should send a notification via socket when ManualTask is finished', async () => {

    const correlationId = uuid.v4();

    return new Promise(async (resolve, reject) => {

      const messageReceivedCallback = async (manualTaskFinishedMessage) => {

        const manualTaskListAfterFinish = await testFixtureProvider
          .consumerApiClientService
          .getManualTasksForProcessModel(defaultIdentity, processModelId);

        should(manualTaskFinishedMessage).not.be.undefined();

        const messageBelongsToWaitingManualTask = manualTaskListAfterFinish.manualTasks.some((manualTask) => {
          return manualTask.id === manualTaskFinishedMessage.flowNodeId;
        });

        should(messageBelongsToWaitingManualTask).be.true();

        resolve();
      };

      testFixtureProvider.consumerApiClientService.onManualTaskFinished(defaultIdentity, messageReceivedCallback);

      await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelId, correlationId);
      await processInstanceHandler.waitForProcessInstanceToReachSuspendedTask(correlationId);
      finishWaitingManualTask();
    });
  });

});
