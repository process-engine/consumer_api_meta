'use strict';

const should = require('should');
const uuid = require('uuid');

const {TestFixtureProvider, ProcessInstanceHandler} = require('../../dist/commonjs');

describe('Consumer API:   Receive global ManualTask Notifications', () => {

  let processInstanceHandler;
  let testFixtureProvider;

  let defaultIdentity;

  const processModelId = 'test_consumer_api_manualtask';
  let correlationId;
  let manualTaskToFinish;

  const noopCallback = () => {};

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    defaultIdentity = testFixtureProvider.identities.defaultUser;

    const processModelsToImport = [processModelId];

    await testFixtureProvider.importProcessFiles(processModelsToImport);

    processInstanceHandler = new ProcessInstanceHandler(testFixtureProvider);
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should send a notification via socket when ManualTask is suspended', async () => {

    correlationId = uuid.v4();

    return new Promise(async (resolve, reject) => {

      const notificationReceivedCallback = async (manualTaskWaitingMessage) => {

        should.exist(manualTaskWaitingMessage);
        // Store this for use in the second test, where we wait for the manualTaskFinished notification.
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

      const subscribeOnce = true;
      await testFixtureProvider
        .consumerApiClientService
        .onManualTaskWaiting(defaultIdentity, notificationReceivedCallback, subscribeOnce);

      await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelId, correlationId);
    });
  });

  it('should send a notification via socket when a ManualTask is finished', async () => {

    return new Promise(async (resolve, reject) => {

      let notificationReceived = false;

      const notificationReceivedCallback = async (manualTaskFinishedMessage) => {
        should(manualTaskFinishedMessage).not.be.undefined();
        should(manualTaskFinishedMessage.flowNodeId).be.equal(manualTaskToFinish.flowNodeId);
        should(manualTaskFinishedMessage.processModelId).be.equal(manualTaskToFinish.processModelId);
        should(manualTaskFinishedMessage.correlationId).be.equal(manualTaskToFinish.correlationId);
        notificationReceived = true;
      };

      const subscribeOnce = true;
      await testFixtureProvider
        .consumerApiClientService
        .onManualTaskFinished(defaultIdentity, notificationReceivedCallback, subscribeOnce);

      const processFinishedCallback = () => {
        if (!notificationReceived) {
          throw new Error('Did not receive the expected notification about the finished ManualTask!');
        }
        resolve();
      };
      processInstanceHandler.waitForProcessInstanceToEnd(correlationId, processModelId, processFinishedCallback);
      finishWaitingManualTask();
    });
  });

  it('should fail to subscribe for the ManualTaskWaiting notification, if the user is unauthorized', async () => {
    try {
      const subscribeOnce = true;
      const subscription = await testFixtureProvider
        .consumerApiClientService
        .onManualTaskWaiting({}, noopCallback, subscribeOnce);
      should.fail(subscription, undefined, 'This should not have been possible, because the user is unauthorized!');
    } catch (error) {
      const expectedErrorMessage = /no auth token/i;
      const expectedErrorCode = 401;
      should(error.message).be.match(expectedErrorMessage);
      should(error.code).be.match(expectedErrorCode);
    }
  });

  it('should fail to subscribe for the ManualTaskFinished notification, if the user is unauthorized', async () => {
    try {
      const subscribeOnce = true;
      const subscription = await testFixtureProvider
        .consumerApiClientService
        .onManualTaskFinished({}, noopCallback, subscribeOnce);
      should.fail(subscription, undefined, 'This should not have been possible, because the user is unauthorized!');
    } catch (error) {
      const expectedErrorMessage = /no auth token/i;
      const expectedErrorCode = 401;
      should(error.message).be.match(expectedErrorMessage);
      should(error.code).be.match(expectedErrorCode);
    }
  });

  async function finishWaitingManualTask() {

    const processInstanceId = manualTaskToFinish.processInstanceId;
    const manualTaskInstanceId = manualTaskToFinish.flowNodeInstanceId;

    await testFixtureProvider
      .consumerApiClientService
      .finishManualTask(defaultIdentity, processInstanceId, manualTaskToFinish.correlationId, manualTaskInstanceId);
  }

});
