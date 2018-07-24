'use strict';

const should = require('should');
const uuid = require('uuid');

const StartCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

// eslint-disable-next-line
const testCase = 'Consumer API:   POST  ->  /process_models/:process_model_key/start_events/:start_event_key/start?start_callback_type=3&end_event_key=value';
describe(`Consumer API: ${testCase}`, () => {

  let testFixtureProvider;
  let consumerContext;

  const startCallbackType = StartCallbackType.CallbackOnEndEventReached;

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
      correlationId: uuid.v4(),
      inputValues: {},
    };

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType, endEventKey);

    should(result).have.property('correlationId');
    should(result.correlationId).be.equal(payload.correlationId);
  });

  it('should start the process, wait until the end event was reached and return a generated correlation ID, when none is provided', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'EndEvent_Success';
    const payload = {
      inputValues: {},
    };

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType, endEventKey);

    should(result).have.property('correlationId');
    should(result.correlationId).be.a.String();
  });

  it('should execute a process with sublanes, when the user can access all lanes', async () => {
    const processModelKey = 'test_consumer_api_sublane_process';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'EndEvent_1';

    const payload = {
      inputValues: {
        test_config: 'same_lane',
      },
    };

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelKey, startEventKey, payload, startCallbackType, endEventKey);

    should(result).have.property('correlationId');
    should(result.correlationId).be.a.String();
  });

  it('should execute a process with sublanes, when the user can only access one sublane and process execution never changes sublanes', async () => {
    const processModelKey = 'test_consumer_api_sublane_process';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'EndEvent_1';

    const payload = {
      inputValues: {
        test_config: 'same_lane',
      },
    };

    const laneuserContext = testFixtureProvider.context.userWithAccessToSubLaneC;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(laneuserContext, processModelKey, startEventKey, payload, startCallbackType, endEventKey);

    should(result).have.property('correlationId');
    should(result.correlationId).be.a.String();
  });
});
