'use strict';

const should = require('should');
const uuid = require('uuid');

const StartCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

// eslint-disable-next-line
describe(`Consumer API:   Receive Process Terminated Notification`, () => {

  let testFixtureProvider;
  let consumerContext;

  const processModelId = 'test_consumer_api_process_terminate';

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    consumerContext = testFixtureProvider.context.defaultUser;

    const processModelsToImport = [
      processModelId,
    ];

    await testFixtureProvider.importProcessFiles(processModelsToImport);
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  function wait(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }

  it('should send a notification via socket when process is terminated', async () => {

    const startEventId = 'StartEvent_1';
    const endEventId = 'EndEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    let processTerminatedMessage;

    testFixtureProvider.consumerApiClientService.onProcessTerminated((message) => {
      processTerminatedMessage = message;
    });

    await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelId, startEventId, payload, startCallbackType);

    await wait(3000);

    should(processTerminatedMessage).not.be.undefined();
    should(processTerminatedMessage).have.property('correlationId');
    should(processTerminatedMessage.correlationId).equal(payload.correlationId);
    should(processTerminatedMessage).have.property('flowNodeId');
    should(processTerminatedMessage.flowNodeId).equal(endEventId);
  });

});
