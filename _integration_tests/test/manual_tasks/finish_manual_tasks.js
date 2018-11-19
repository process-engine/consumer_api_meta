'use strict';

const should = require('should');

const {TestFixtureProvider, ProcessInstanceHandler} = require('../../dist/commonjs');

const testCase = 'POST -> /process_models/:process_model_id/correlations/:correlation_id/manual_tasks/:manual_task_id/finish';
describe(`Consumer API: ${testCase}`, () => {

  let processInstanceHandler;
  let testFixtureProvider;
  let defaultIdentity;

  const processModelId = 'test_consumer_api_manualtask';

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    defaultIdentity = testFixtureProvider.identities.defaultUser;

    await testFixtureProvider.importProcessFiles([processModelId]);

    processInstanceHandler = new ProcessInstanceHandler(testFixtureProvider);
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  async function createWaitingManualTask() {

    console.log('started');

    const correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelId);
    await processInstanceHandler.waitForProcessInstanceToReachSuspendedTask(correlationId);

    const manualTaskList = await testFixtureProvider
      .consumerApiClientService
      .getManualTasksForProcessModelInCorrelation(defaultIdentity, processModelId, correlationId);

    return manualTaskList.manualTasks[0];
  }

  it('should successfully finish the manual task.', async () => {

    const manualTask = await createWaitingManualTask();
    const {correlationId, flowNodeInstanceId, processInstanceId} = manualTask;

    console.log('manueltask from testfile', manualTask);

    await testFixtureProvider
      .consumerApiClientService
      .finishManualTask(defaultIdentity, processInstanceId, correlationId, flowNodeInstanceId);
  });

  it('should fail to finish the manual task, if the given process_model_id does not exist', async () => {
    
    const manualTask = await createWaitingManualTask();
    const {correlationId, flowNodeInstanceId} = manualTask;

    const invalidprocessInstanceId = 'invalidprocessInstanceId';

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishManualTask(defaultIdentity, invalidprocessInstanceId, correlationId, flowNodeInstanceId);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /does not have a ManualTask/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to finish an already finished manual task.', async () => {

    const manualTask = await createWaitingManualTask();
    const {correlationId, flowNodeInstanceId, processInstanceId} = manualTask;

    await testFixtureProvider
      .consumerApiClientService
      .finishManualTask(defaultIdentity, processInstanceId, correlationId, flowNodeInstanceId);

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishManualTask(defaultIdentity, processInstanceId, correlationId, flowNodeInstanceId);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      should(error.code).be.match(expectedErrorCode);
    }
  });

  it('should fail to finish the manual task, when the user is unauthorized', async () => {

    const manualTask = await createWaitingManualTask();
    const {correlationId, flowNodeInstanceId, processInstanceId} = manualTask;

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishManualTask({}, processInstanceId, correlationId, flowNodeInstanceId);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to finish the manual task, when the user is forbidden to retrieve it', async () => {

    const manualTask = await createWaitingManualTask();
    const {correlationId, flowNodeInstanceId, processInstanceId} = manualTask;

    const restrictedIdentity = testFixtureProvider.identities.restrictedUser;

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishManualTask(restrictedIdentity, processInstanceId, correlationId, flowNodeInstanceId);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access.*?denied/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

});
