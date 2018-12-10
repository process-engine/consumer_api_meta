'use strict';

const should = require('should');

const {TestFixtureProvider, ProcessInstanceHandler} = require('../../dist/commonjs');

describe('Consumer API GET  ->  /process_models/:process_model_id/correlations/:correlation_id/events', () => {

  let processInstanceHandler;
  let testFixtureProvider;

  let defaultIdentity;

  const processModelIdSignalEvent = 'test_consumer_api_signal_event';

  let correlationId;
  let eventNameToTriggerAfterTest;

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    defaultIdentity = testFixtureProvider.identities.defaultUser;

    await testFixtureProvider.importProcessFiles([processModelIdSignalEvent]);

    processInstanceHandler = new ProcessInstanceHandler(testFixtureProvider);

    correlationId = await processInstanceHandler.startProcessInstanceAndReturnCorrelationId(processModelIdSignalEvent);
    await processInstanceHandler.waitForProcessInstanceToReachSuspendedTask(correlationId);
  });

  after(async () => {
    await cleanup();
    await testFixtureProvider.tearDown();
  });

  it('should return a list of events for a given process model in a given correlation', async () => {

    const eventList = await testFixtureProvider
      .consumerApiClientService
      .getEventsForProcessModelInCorrelation(defaultIdentity, processModelIdSignalEvent, correlationId);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.greaterThan(0);

    eventList.events.forEach((event) => {
      should(event).have.property('id');
      should(event).have.property('processInstanceId');
      should(event).have.property('flowNodeInstanceId');
      should(event).have.property('correlationId');
      should(event).have.property('processModelId');
      should(event).have.property('bpmnType');
      should(event).have.property('eventType');
      should(event).have.property('eventName');
      eventNameToTriggerAfterTest = event.eventName;
    });
  });

  it('should return an empty Array, if the process_model_id does not exist', async () => {

    const invalidProcessModelId = 'invalidprocessModelId';

    const eventList = await testFixtureProvider
      .consumerApiClientService
      .getEventsForProcessModelInCorrelation(defaultIdentity, invalidProcessModelId, correlationId);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.equal(0);
  });

  it('should return an empty Array, if the correlation_id does not exist', async () => {

    const invalidCorrelationId = 'invalidCorrelationId';

    const eventList = await testFixtureProvider
      .consumerApiClientService
      .getEventsForProcessModelInCorrelation(defaultIdentity, processModelIdSignalEvent, invalidCorrelationId);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.equal(0);
  });

  it('should fail to retrieve the correlation\'s events, when the user is unauthorized', async () => {

    try {
      await testFixtureProvider
        .consumerApiClientService
        .getEventsForProcessModelInCorrelation({}, processModelIdSignalEvent, correlationId);

      should.fail('unexpectedSuccessResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the correlation\'s events, when the user forbidden to retrieve it', async () => {

    const restrictedIdentity = testFixtureProvider.identities.restrictedUser;

    try {
      await testFixtureProvider
        .consumerApiClientService
        .getEventsForProcessModelInCorrelation(restrictedIdentity, processModelIdSignalEvent, correlationId);

      should.fail('unexpectedSuccessResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  async function cleanup() {
    return new Promise(async (resolve, reject) => {
      processInstanceHandler.waitForProcessInstanceToEnd(correlationId, processModelIdSignalEvent, resolve);

      await testFixtureProvider
        .consumerApiClientService
        .triggerSignalEvent(defaultIdentity, eventNameToTriggerAfterTest, {});
    });
  }

});
