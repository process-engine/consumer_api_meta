'use strict';

const should = require('should');
const uuid = require('uuid');

const StartCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

// eslint-disable-next-line
describe(`Consumer API:   Receive Process Ended Notification`, () => {

  let testFixtureProvider;
  let consumerContext;

  const processModelId = 'test_consumer_api_process_start';

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

  it('should send a notification via socket when process ends', async () => {

    const startEventId = 'StartEvent_1';
    const endEventId = 'EndEvent_Success';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {},
    };
    const startCallbackType = StartCallbackType.CallbackOnEndEventReached;

    let processEndedMessage;

    testFixtureProvider.consumerApiClientService.onProcessEnded((message) => {
      processEndedMessage = message;
    });

    const result = await testFixtureProvider
      .consumerApiClientService
      .startProcessInstance(consumerContext, processModelId, startEventId, payload, startCallbackType, endEventId);

    should(processEndedMessage).not.be.undefined();
    should(processEndedMessage).have.property('correlationId');
    should(processEndedMessage.correlationId).equal(payload.correlationId);
    should(processEndedMessage).have.property('flowNodeId');
    should(processEndedMessage.flowNodeId).equal(endEventId);
  });

});
