'use strict';

const should = require('should');
const uuid = require('uuid');

const StartCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;

describe('Consumer API:   Receive Process Started Notification', () => {

  let testFixtureProvider;
  let defaultIdentity;

  const processModelId = 'test_consumer_api_process_start';

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    defaultIdentity = testFixtureProvider.identities.defaultUser;

    const processModelsToImport = [
      processModelId,
    ];

    await testFixtureProvider.importProcessFiles(processModelsToImport);
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it.only('should send a notification when a process is finished', async () => {

    return new Promise((resolve, reject) => {

      const startEventId = 'StartEvent_1';
      const endEventId = 'EndEvent_Success';
      const payload = {
        correlationId: uuid.v4(),
        inputValues: {},
      };
      const startCallbackType = StartCallbackType.CallbackOnEndEventReached;

      const onProcessStartedCallback = (processStartedEvent) => {

        if (processStartedEvent.correlationId !== payload.correlationId) {
          return;
        }

        should.exist(processStartedEvent);
        should(processStartedEvent).have.property('correlationId');
        should(processStartedEvent.correlationId).be.equal(payload.correlationId);
        should(processStartedEvent).have.property('flowNodeId');
        should(processStartedEvent.flowNodeId).be.equal(endEventId);

        resolve();
      };

      testFixtureProvider.consumerApiClientService.onProcessStarted(onProcessStartedCallback);

      testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(defaultIdentity, processModelId, startEventId, payload, startCallbackType, endEventId);

    });
  });

});
