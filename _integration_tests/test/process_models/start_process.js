'use strict';

const should = require('should');
const uuid = require('uuid');

const StartCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   POST  ->  /process_models/:process_model_key/start_events/:start_event_key/start', function startProcessInstance() {

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

  it('should start the process and return the correlation ID (return_on = on_process_instance_started)', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

    should(result).have.property('correlationId');
    should(result.correlationId).be.equal(payload.correlationId);
  });

  it('should start the process and return the correlation ID (return_on = on_process_instance_finished)', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

    should(result).have.property('correlationId');
    should(result.correlationId).be.equal(payload.correlationId);
  });

  it('should start the process and return a generated correlation ID, when none is provided', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      inputValues: {},
    };
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

    should(result).have.property('correlationId');
  });

  it('should start the process with using \'on_process_instance_started\' as a default value for return_on', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      inputValues: {},
    };

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload);

    should(result).have.property('correlationId');
    should(result.correlationId).be.a.String();
  });

  it('should sucessfully execute a process with two different sublanes', async () => {
    const processModelKey = 'test_consumer_api_sublane_process';
    const startEventKey = 'StartEvent_1';

    const payload = {
      inputValues: {
        test_config: 'different_lane',
      },
    };

    const laneuserContext = testFixtureProvider.context.laneUser;
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(laneuserContext, processModelKey, startEventKey, payload, startCallbackType);

    should(result).have.property('correlationId');
  });

  it('should successfully execute a process with an end event that is on a different sublane', async () => {
    const processModelKey = 'test_consumer_api_sublane_process';
    const startEventKey = 'StartEvent_1';

    const payload = {
      inputValues: {
        test_config: 'different_lane',
      },
    };

    const userContext = testFixtureProvider.context.userWithNoAccessToSubLaneC;
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(userContext, processModelKey, startEventKey, payload, startCallbackType);

    should(result).have.property('correlationId');
  });

  it('should fail to start the process, when the user is unauthorized', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {
        causeError: true,
      },
    };

    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance({}, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to execute a process without sublanes, if the user cannot access the lane with the start event', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {
        causeError: true,
      },
    };

    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(restrictedContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to execute a process with sublanes, if the user cannot access the lane with the start event', async () => {
    const processModelKey = 'test_consumer_api_sublane_process';
    const startEventKey = 'StartEvent_1';

    const payload = {
      inputValues: {
        test_config: 'different_lane',
      },
    };

    const userContext = testFixtureProvider.context.userWithNoAccessToSubLaneD;
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(userContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'The restricted user should not be able to execute the process inside the sublane');

    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i;

      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to start a process with sublanes, if the user cannot access the root lane.', async () => {
    const processModelKey = 'test_consumer_api_sublane_process';
    const startEventKey = 'Start_Event_1';

    const payload = {
      inputValues: {
        test_config: 'different_lane',
      },
    };

    const userContext = testFixtureProvider.context.userWithNoAccessToLaneA;
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(userContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'The user can execute the process even if he has no access rights to the parent lane.');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i;

      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to start the process, if the given process_model_key does not exist', async () => {

    const processModelKey = 'invalidProcessModelKey';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };

    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /key.*?not found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to start the process, if the given start_event_key does not exist', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'invalidStartEventKey';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };

    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /start event.*?not found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to start the process, if the process model is not marked as executable', async () => {

    const processModelKey = 'test_consumer_api_non_executable_process';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };

    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 400;
      const expectedErrorMessage = /not executable/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to start the process, if the given return_on option is invalid', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };

    const startCallbackType = 'invalidReturnOption';

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 400;
      const expectedErrorMessage = /not a valid return option/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  // TODO: What exactly constitutes a valid payload anyway?
  it.skip('should fail to start the process, if the given payload is invalid', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = 'i am missing vital properties';

    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 400;
      const expectedErrorMessage = /invalid payload/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  // TODO: Find a way to simulate a start event error
  it.skip('should fail, if starting the request caused an error', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };

    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 500;
      should(error.message).be.empty();
      should(error.code)
        .match(expectedErrorCode);
    }
  });

  it('should fail, if the request was aborted before the desired return_on event was reached', async () => {
    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {
        causeError: true,
      },
    };

    // NOTE: This test case can by its very definition never work with .CallbackOnProcessInstanceCreated".
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 500;
      const expectedErrorMessage = /process failed.*?error/i;
      should(error.message)
        .match(expectedErrorMessage);
      should(error.code)
        .match(expectedErrorCode);
    }
  });
});
