'use strict';

const should = require('should');
const uuid = require('uuid');

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

const testCase = 'POST ->  /process_models/:process_model_key/start_events/:start_event_key/end_event/:end_event_key/start_and_resolve_by_end_event';
describe(`Consumer API: ${testCase}`, function startProcessAndAwaitEndEvent() {

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

  it('should start the process and return the provided correlation ID, after the given end event was reached', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'EndEvent_Success';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {},
    };

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstanceAndAwaitEndEvent(consumerContext, processModelKey, startEventKey, endEventKey, payload);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.equal(payload.correlation_id);
  });

  it('should start the process, wait until the end event was reached and return a generated correlation ID, when none is provided', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'EndEvent_Success';
    const payload = {
      input_values: {},
    };

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstanceAndAwaitEndEvent(consumerContext, processModelKey, startEventKey, endEventKey, payload);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.a.String();
  });

  it('should fail to start the process, when the user is unauthorized', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'EndEvent_Success';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {},
    };

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstanceAndAwaitEndEvent({}, processModelKey, startEventKey, endEventKey, payload);

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
    const endEventKey = 'EndEvent_Success';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {},
    };

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstanceAndAwaitEndEvent(restrictedContext, processModelKey, startEventKey, endEventKey, payload);

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
    const endEventKey = 'EndEvent_Success';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {},
    };

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstanceAndAwaitEndEvent(consumerContext, processModelKey, startEventKey, endEventKey, payload);

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
    const endEventKey = 'EndEvent_Success';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {},
    };

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstanceAndAwaitEndEvent(consumerContext, processModelKey, startEventKey, endEventKey, payload);

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

  it('should fail to start the process, if the given end_event_key does not exist', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'invalidEndEventKey';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {},
    };

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstanceAndAwaitEndEvent(consumerContext, processModelKey, startEventKey, endEventKey, payload);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /end event.*?not found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to start the process, if the process model is not marked as executable', async () => {

    const processModelKey = 'test_consumer_api_non_executable_process';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'EndEvent_Success';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {},
    };

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstanceAndAwaitEndEvent(consumerContext, processModelKey, startEventKey, endEventKey, payload);

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

  // TODO: Bad Path not implemented yet
  // TODO: What exactly constitutes a valid payload anyway?
  it.skip('should fail to start the process, if the given payload is invalid', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'EndEvent_Success';
    const payload = 'i am missing vital properties';

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstanceAndAwaitEndEvent(consumerContext, processModelKey, startEventKey, endEventKey, payload);

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
    const endEventKey = 'EndEvent_Success';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {},
    };

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstanceAndAwaitEndEvent(consumerContext, processModelKey, startEventKey, endEventKey, payload);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 500;
      should(error.message).be.empty();
      should(error.code)
        .match(expectedErrorCode);
    }
  });

  it('should fail, if the request was aborted before the desired EndEvent was reached', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'EndEvent_Success';
    const payload = {
      correlation_id: uuid.v4(),
      input_values: {
        causeError: true,
      },
    };

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstanceAndAwaitEndEvent(consumerContext, processModelKey, startEventKey, endEventKey, payload);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 500;
      const expectedErrorMessage = /process failed.*?error/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

});