'use strict';

const should = require('should');

const TestFixtureProvider = require('../../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   POST  ->  /process_models/:process_model_key/correlations/:correlation_id/user_tasks/:user_task_id/finish', function() {

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
    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, 'StartEvent_1');

    return result.correlation_id;
  }

  it('should successfully finish the given user task.', async () => {
    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300);
    });

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      form_fields: {
        Form_XGSVBgio: true,
      }
    };

    await testFixtureProvider
      .consumerApiClientService
      .finishUserTask(consumerContext, processModelKey, correlationId, userTaskId, userTaskResult);
  });

  it('should fail to finish the user task, when the user is unauthorized', async () => {

    const processModelKey = 'consumer_api_usertask_test';
    
    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300);
    });

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      form_fields: {
        Form_XGSVBgio: true,
      }
    };
    
    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask({}, processModelKey, correlationId, userTaskId, userTaskResult);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to finish the user task, when the user forbidden to retrieve it', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300);
    });

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      form_fields: {
        Form_XGSVBgio: true,
      }
    };

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(restrictedContext, processModelKey, correlationId, userTaskId, userTaskResult);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to finish the user task, if the given process_model_key does not exist', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300);
    });

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      form_fields: {
        Form_XGSVBgio: true,
      }
    };

    const invalidProcessModelKey = 'invalidProcessModelKey';

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(consumerContext, invalidProcessModelKey, correlationId, userTaskId, userTaskResult);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not part of/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to finish the user task, if the given correlation_id does not exist', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300);
    });

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = {
      form_fields: {
        Form_XGSVBgio: true,
      }
    };

    const invalidCorrelationId = 'invalidCorrelationId';

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(consumerContext, processModelKey, invalidCorrelationId, userTaskId, userTaskResult);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not found/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to finish the user task, if the given user_task_id does not exist', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300);
    });

    const invalidUserTaskId = 'invalidUserTaskId';
    const userTaskResult = {
      form_fields: {
        Form_XGSVBgio: true,
      }
    };

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(consumerContext, processModelKey, correlationId, invalidUserTaskId, userTaskResult);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /UserTask .+ not found/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to finish the user task, if the given payload is invalid', async () => {

    const processModelKey = 'consumer_api_usertask_test';

    const correlationId = await startProcessAndReturnCorrelationId(processModelKey);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300);
    });

    const userTaskId = 'Task_1vdwmn1';
    const userTaskResult = 'invalidUserTaskResult';

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(consumerContext, processModelKey, correlationId, userTaskId, userTaskResult);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 400;
      should(error.code).match(expectedErrorCode);
    }
  });

  // TODO: Bad Path not implemented yet
  // TODO: Find a way to simulate a process error
  it.skip('should fail, if attempting to finish the user task caused an error', async () => {

    // TODO: Replace with real values
    const processModelKey = 'test_consumer_api_user_task_finish';
    const correlationId = 'correlationId';
    const userTaskId = 'invalidUserTaskId';
    const userTaskResult = {};

    try {
      await testFixtureProvider
        .consumerApiClientService
        .finishUserTask(consumerContext, processModelKey, correlationId, userTaskId, userTaskResult);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 500;
      const expectedErrorMessage = /could not be finished/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

});
