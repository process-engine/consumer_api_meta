'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;
const ProcessInstanceHandler = require('../../dist/commonjs').ProcessInstanceHandler;

describe('Consumer API:   GET  ->  /correlations/:correlation_id/events', () => {

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
    await triggerWaitingEventAfterTest();
    await testFixtureProvider.tearDown();
  });

  async function triggerWaitingEventAfterTest() {

    await testFixtureProvider
      .consumerApiClientService
      .triggerSignalEvent(defaultIdentity, eventNameToTriggerAfterTest, {});
  }

  it('should return a correlation\'s events by its correlation_id through the consumer api', async () => {

    const eventList = await testFixtureProvider
      .consumerApiClientService
      .getEventsForCorrelation(defaultIdentity, correlationId);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.equal(1);

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

  it('should return an empty Array, if the correlation_id does not exist', async () => {

    const invalidCorrelationId = 'invalidCorrelationId';

    const eventList = await testFixtureProvider
      .consumerApiClientService
      .getEventsForCorrelation(defaultIdentity, invalidCorrelationId);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.equal(0);
  });

  it('should return an empty Array, when the user has no access to any of the events', async () => {

    const restrictedIdentity = testFixtureProvider.identities.restrictedUser;

    const invalidCorrelationId = 'invalidCorrelationId';

    const eventList = await testFixtureProvider
      .consumerApiClientService
      .getEventsForCorrelation(restrictedIdentity, invalidCorrelationId);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.equal(0);

  });

  it('should fail to retrieve the correlation\'s events, when the user is unauthorized', async () => {

    try {
      await testFixtureProvider.consumerApiClientService.getEventsForCorrelation({}, correlationId);

      should.fail('unexpectedSuccessResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

});
