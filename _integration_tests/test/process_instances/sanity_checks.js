'use strict';

const should = require('should');
const uuid = require('uuid');

const StartCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;
// eslint-disable-next-line
const testCase = 'Consumer API:   POST  ->  /process_models/:process_model_key/start_events/:start_event_key/start';
describe(`Consumer API: ${testCase}`, function startProcessInstance() {

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
      const expectedErrorMessage = /startevent.*?not found/i;
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
      correlationId: uuid.v4(),
      inputValues: {},
    };

    const startCallbackType = StartCallbackType.CallbackOnEndEventReached;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType, endEventKey);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /endevent.*?not found/i;
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

  it('should fail to start the process, if the given startCallbackType option is invalid', async () => {

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
      const expectedErrorMessage = /critical error/i;
      should(error.message)
        .match(expectedErrorMessage);
      should(error.code)
        .match(expectedErrorCode);
    }
  });
});
