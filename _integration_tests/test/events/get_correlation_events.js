'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;

describe('Consumer API:   GET  ->  /correlations/:correlation_id/events', () => {

  let testFixtureProvider;
  let defaultIdentity;

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    defaultIdentity = testFixtureProvider.identities.defaultUser;
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should return a correlation\'s events by its correlation_id through the consumer api', async () => {

    const correlationId = 'test_get_events_for_process_model';

    const eventList =
      await testFixtureProvider.consumerApiClientService.getEventsForCorrelation(defaultIdentity, correlationId);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.greaterThan(0);

    eventList.events.forEach((event) => {
      should(event).have.property('id');
      should(event).have.property('processInstanceId');
      should(event).have.property('data');
    });
  });

  it.skip('should return an empty Array, if the correlation_id does not exist', async () => {

    const invalidCorrelationId = 'invalidCorrelationId';

    const eventList = await testFixtureProvider
      .consumerApiClientService
      .getEventsForCorrelation(defaultIdentity, invalidCorrelationId);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.equal(0);
  });

  it('should fail to retrieve the correlation\'s events, when the user is unauthorized', async () => {

    const correlationId = 'test_get_events_for_process_model';

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

  it.skip('should fail to retrieve the correlation\'s events, when the user forbidden to retrieve it', async () => {

    const correlationId = 'test_get_events_for_process_model';

    const restrictedIdentity = testFixtureProvider.identities.restrictedUser;

    try {
      await testFixtureProvider.consumerApiClientService.getEventsForCorrelation(restrictedIdentity, correlationId);

      should.fail('unexpectedSuccessResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

});
