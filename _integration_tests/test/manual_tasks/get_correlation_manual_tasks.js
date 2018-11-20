'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;
const ProcessInstanceHandler = require('../../dist/commonjs').ProcessInstanceHandler;

describe('ConsumerAPI:   GET  ->  /correlations/:correlation_id/manual_tasks', () => {

  let processInstanceHandler;
  let testFixtureProvider;

  let defaultIdentity;

  const processModelId = 'test_consumer_api_manualtask';
  const processModelIdNoManualTasks = 'test_consumer_api_manualtask_empty';
  const processModelIdCallActivity = 'test_consumer_api_manualtask_call_acvtivity';
  const processModelIdCallActivitySubprocess = 'test_consumer_api_manualtask_call_acvtivity_subprocess';

  let correlationId;

  const manualTasksToFinishAfterTest = [];

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    defaultIdentity = testFixtureProvider.identities.defaultUser;

    await testFixtureProvider.importProcessFiles([
      processModelId,
      processModelIdNoManualTasks,
      processModelIdCallActivity,
      processModelIdCallActivitySubprocess,
    ]);

    processInstanceHandler = new ProcessInstanceHandler(testFixtureProvider);

    correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelId);
    await processInstanceHandler.waitForProcessInstanceToReachSuspendedTask(correlationId);
  });

  after(async () => {
    await finishWaitingManualTasksAfterTests();
    await testFixtureProvider.tearDown();
  });

  async function finishWaitingManualTasksAfterTests() {

    for (const manualTask of manualTasksToFinishAfterTest) {
      const processModelId = manualTask.processModelId;
      const manualTaskId = manualTask.id;

      await testFixtureProvider
        .consumerApiClientService
        .finishManualTask(defaultIdentity, processModelId, manualTask.correlationId, manualTaskId);
    }
  }

  it('should return a Correlation\'s ManualTasks by its CorrelationId through the ConsumerAPI', async () => {

    const manualTaskList = await testFixtureProvider
      .consumerApiClientService
      .getManualTasksForCorrelation(defaultIdentity, correlationId);

    should(manualTaskList).have.property('manualTasks');

    should(manualTaskList.manualTasks).be.instanceOf(Array);
    should(manualTaskList.manualTasks.length).be.greaterThan(0);

    const manualTask = manualTaskList.manualTasks[0];

    manualTasksToFinishAfterTest.push(manualTask);

    should(manualTask).have.property('id');
    should(manualTask).have.property('name');
    should(manualTask).have.property('correlationId');
    should(manualTask).have.property('processModelId');
    should(manualTask).have.property('processInstanceId');
    should(manualTask).have.property('tokenPayload');
  });

  it('should return a list of ManualTasks from a call activity, by the given correlationId through the ConsumerAPI', async () => {

    const correlationIdCallActivity = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelIdCallActivity);
    await processInstanceHandler.waitForProcessInstanceToReachSuspendedTask(correlationIdCallActivity, processModelIdCallActivitySubprocess);

    const manualTaskList = await testFixtureProvider
      .consumerApiClientService
      .getManualTasksForCorrelation(defaultIdentity, correlationIdCallActivity);

    should(manualTaskList).have.property('manualTasks');

    should(manualTaskList.manualTasks).be.instanceOf(Array);
    should(manualTaskList.manualTasks.length).be.greaterThan(0);

    const manualTask = manualTaskList.manualTasks[0];

    manualTasksToFinishAfterTest.push(manualTask);

    should(manualTask).have.property('id');
    should(manualTask).have.property('correlationId');
    should(manualTask).have.property('processModelId');
    should(manualTask).have.property('tokenPayload');
  });

  it('should return an empty Array, if the given correlation does not have any ManualTasks', async () => {

    await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelIdNoManualTasks);

    await processInstanceHandler.wait(500);

    const manualTaskList = await testFixtureProvider
      .consumerApiClientService
      .getManualTasksForProcessModel(defaultIdentity, processModelIdNoManualTasks);

    should(manualTaskList).have.property('manualTasks');
    should(manualTaskList.manualTasks).be.instanceOf(Array);
    should(manualTaskList.manualTasks.length).be.equal(0);
  });

  it('should return an empty Array, if the correlationId does not exist', async () => {

    const invalidCorrelationId = 'invalidCorrelationId';

    const manualTaskList = await testFixtureProvider
      .consumerApiClientService
      .getManualTasksForCorrelation(defaultIdentity, invalidCorrelationId);

    should(manualTaskList).have.property('manualTasks');
    should(manualTaskList.manualTasks).be.instanceOf(Array);
    should(manualTaskList.manualTasks.length).be.equal(0);
  });

  it('should fail to retrieve the Correlation\'s ManualTasks, when the user is unauthorized', async () => {

    try {
      const manualTaskList = await testFixtureProvider
        .consumerApiClientService
        .getManualTasksForCorrelation({}, correlationId);

      should.fail(manualTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the Correlation\'s ManualTasks, when the user forbidden to retrieve it', async () => {

    const restrictedIdentity = testFixtureProvider.identities.restrictedUser;

    try {
      const manualTaskList = await testFixtureProvider
        .consumerApiClientService
        .getManualTasksForCorrelation(restrictedIdentity, correlationId);

      should.fail(manualTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

});
