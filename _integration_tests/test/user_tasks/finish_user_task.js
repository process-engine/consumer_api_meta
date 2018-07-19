'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;
const ProcessInstanceHandler = require('../../dist/commonjs').ProcessInstanceHandler;

const testTimeoutMilliseconds = 5000;

const testCase = 'POST -> /process_models/:process_model_key/correlations/:correlation_id/user_tasks/:user_task_id/finish';
describe(`Consumer API: ${testCase}`, function finishUserTask() {

  let processInstanceHandler;
  let testFixtureProvider;
  let consumerContext;

  this.timeout(testTimeoutMilliseconds);

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    consumerContext = testFixtureProvider.context.defaultUser;

    processInstanceHandler = new ProcessInstanceHandler(testFixtureProvider);
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should successfully finish the given user task.', async () => {
    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelKey);
    await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      formFields: {
        Form_XGSVBgio: true,
      },
    };

    await testFixtureProvider
      .consumerApiClientService
      .finishUserTask(consumerContext, processModelKey, correlationId, userTaskId, userTaskResult);
  });

  it('should fail to finish the user task, if the given process_model_key does not exist', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelKey);
    await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      formFields: {
        Form_XGSVBgio: true,
      },
    };

    const invalidProcessModelKey = 'invalidProcessModelKey';

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(consumerContext, invalidProcessModelKey, correlationId, userTaskId, userTaskResult);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /no process instance.*?found/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to finish the user task, if the given correlation_id does not exist', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelKey);
    await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);

    const invalidCorrelationId = 'invalidCorrelationId';

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      formFields: {
        Form_XGSVBgio: true,
      },
    };

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(consumerContext, processModelKey, invalidCorrelationId, userTaskId, userTaskResult);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /no correlation.*?found/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to finish the user task, if the given user_task_id does not exist', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelKey);
    await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);

    const invalidUserTaskId = 'invalidUserTaskId';
    const userTaskResult = {
      formFields: {
        Form_XGSVBgio: true,
      },
    };

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(consumerContext, processModelKey, correlationId, invalidUserTaskId, userTaskResult);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /process model.*?in correlation.*?does not have.*?user task/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to finish an already finished user task.', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelKey);
    await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      formFields: {
        Form_XGSVBgio: true,
      },
    };

    await testFixtureProvider
      .consumerApiClientService
      .finishUserTask(consumerContext, processModelKey, correlationId, userTaskId, userTaskResult);

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(consumerContext, processModelKey, correlationId, userTaskId, userTaskResult);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /process model.*?in correlation.*?does not have.*?user task/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to finish the user task, if the given payload is invalid', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelKey);
    await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = 'invalidUserTaskResult';

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(consumerContext, processModelKey, correlationId, userTaskId, userTaskResult);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 400;
      should(error.code).be.match(expectedErrorCode);
    }
  });

  it('should fail to finish the user task, when the user is unauthorized', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelKey);
    await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      formFields: {
        Form_XGSVBgio: true,
      },
    };

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask({}, processModelKey, correlationId, userTaskId, userTaskResult);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to finish the user task, when the user is forbidden to retrieve it', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelKey);
    await processInstanceHandler.waitForProcessInstanceToReachUserTask(correlationId);

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      formFields: {
        Form_XGSVBgio: true,
      },
    };

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(restrictedContext, processModelKey, correlationId, userTaskId, userTaskResult);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

});
