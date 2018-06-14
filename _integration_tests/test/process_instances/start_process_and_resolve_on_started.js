'use strict';

const should = require('should');
const uuid = require('uuid');

const StartCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;
// eslint-disable-next-line
const testCase = 'Consumer API:   POST  ->  /process_models/:process_model_key/start_events/:start_event_key/start?start_callback_type=1';
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

  it('should start the process and return the correlation ID', async () => {

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
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

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
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(userContext, processModelKey, startEventKey, payload, startCallbackType);

    should(result).have.property('correlationId');
  });
});
