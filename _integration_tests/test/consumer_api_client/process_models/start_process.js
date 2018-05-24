'use strict';

const should = require('should');
const uuid = require('uuid');

const startCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

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
      correlation_id: uuid.v4(),
      input_values: {},
    };
    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.equal(payload.correlation_id);
  });

  it('should start the process and return the correlation ID (return_on = on_process_instance_finished)', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {},
    };
    const returnOn = startCallbackType.CallbackOnEndEventReached;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.equal(payload.correlation_id);
  });

  it('should start the process and return a generated correlation ID, when none is provided', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      input_values: {},
    };
    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

    should(result).have.property('correlation_id');
  });

  it('should start the process with using \'on_process_instance_started\' as a default value for return_on', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      input_values: {},
    };

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.a.String();
  });

  it('should fail to start the process, when the user is unauthorized', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {
        causeError: true,
      },
    };

    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance({}, processModelKey, startEventKey, payload, returnOn);

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

  it('should fail to start the process, when the user forbidden to start it', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {
        causeError: true,
      },
    };

    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(restrictedContext, processModelKey, startEventKey, payload, returnOn);

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

  it('should fail to start the process, if the given process_model_key does not exist', async () => {

    const processModelKey = 'invalidProcessModelKey';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {},
    };

    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

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
      correlation_id: uuid.v4(),
      input_values: {},
    };

    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

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
      correlation_id: uuid.v4(),
      input_values: {},
    };

    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

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
      correlation_id: uuid.v4(),
      input_values: {},
    };

    const returnOn = 'invalidReturnOption';

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

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

    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

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
      correlation_id: uuid.v4(),
      input_values: {},
    };

    const returnOn = startCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

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
      correlation_id: uuid.v4(),
      input_values: {
        causeError: true,
      },
    };

    // NOTE: This test case can by its very definition never work with .CallbackOnProcessInstanceCreated".
    const returnOn = startCallbackType.CallbackOnEndEventReached;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, returnOn);

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

  it('should sucessfully start and execute a process, where the start event lies in a sublane', async () => {
    const processModelKey = 'test_consumer_api_sublane_normal_process';
    const startEventKey = 'StartEvent_1';

    const payload = {};
    const defaultUserContext = consumerContext;
    const returnOn = startCallbackType.CallbackOnEndEventReached;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(defaultUserContext, processModelKey, startEventKey, payload, returnOn);

    // Check if the result contains the correlation id
    should(result).has.property('correlation_id');
  });

  it('should try to start a process which in a sublane with a user, that has no permissions to access any of the lanes.', async () => {

    const processModelKey = 'test_consumer_api_sublane_normal_process';
    const startEventKey = 'StartEvent_1';

    const payload = {};
    const restrictedUserContext = testFixtureProvider.context.restrictedUser;
    const returnOn = startCallbackType.CallbackOnEndEventReached;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(restrictedUserContext, processModelKey, startEventKey, payload, returnOn);

      should.fail(result, undefined, 'The restricted user should not be able to execute the process inside the sublane.');

    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }

  });

});
