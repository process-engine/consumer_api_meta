'use strict';

const should = require('should');
const uuid = require('node-uuid');

const StartCallbackType = require('@process-engine/consumer_api_contracts').DataModels.ProcessModels.StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;

// eslint-disable-next-line
const testCase = 'Consumer API:   POST  ->  /process_models/:process_model_id/start_events/:start_event_id/start?start_callback_type=2';
describe(`Consumer API: ${testCase}`, () => {

  let testFixtureProvider;
  let defaultIdentity;

  const processModelId = 'test_consumer_api_process_start';
  const processModelIdSublanes = 'test_consumer_api_sublane_process';

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    defaultIdentity = testFixtureProvider.identities.defaultUser;

    const processModelsToImport = [
      processModelId,
      processModelIdSublanes,
    ];

    await testFixtureProvider.importProcessFiles(processModelsToImport);
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should start the process and return the correlation ID', async () => {

    const startEventId = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    const result = await testFixtureProvider
      .consumerApiClient
      .startProcessInstance(defaultIdentity, processModelId, payload, startCallbackType, startEventId);

    should(result).have.property('correlationId');
    should(result.correlationId).be.equal(payload.correlationId);
  });

  it('should start the process and return a generated correlation ID, when none is provided', async () => {

    const startEventId = 'StartEvent_1';
    const payload = {
      inputValues: {},
    };
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    const result = await testFixtureProvider
      .consumerApiClient
      .startProcessInstance(defaultIdentity, processModelId, payload, startCallbackType, startEventId);

    should(result).have.property('correlationId');
  });

  it('should sucessfully execute a process with two different sublanes', async () => {

    const startEventId = 'StartEvent_1';

    const payload = {
      inputValues: {
        test_config: 'different_lane',
      },
    };

    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    const result = await testFixtureProvider
      .consumerApiClient
      .startProcessInstance(defaultIdentity, processModelIdSublanes, payload, startCallbackType, startEventId);

    should(result).have.property('correlationId');
  });

  it('should successfully execute a process with an end event that is on a different sublane', async () => {

    const startEventId = 'StartEvent_1';

    const payload = {
      inputValues: {
        test_config: 'different_lane',
      },
    };

    const userIdentity = testFixtureProvider.identities.defaultUser;
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    const result = await testFixtureProvider
      .consumerApiClient
      .startProcessInstance(userIdentity, processModelIdSublanes, payload, startCallbackType, startEventId);

    should(result).have.property('correlationId');
  });
});
