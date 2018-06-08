'use strict';

const should = require('should');

const TestFixtureProvider = require('../../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

describe('Consumer API GET  ->  /process_models/:process_model_key/correlations/:correlation_id/events', function getCorrelationProcessModelEvents() {

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

  it('should return a list of events for a given process model in a given correlation', async () => {

    const processModelKey = 'test_get_events_for_process_model';
    const correlationId = 'correlationId';

    const eventList = await testFixtureProvider
      .consumerApiClientService
      .getEventsForProcessModelInCorrelation(consumerContext, processModelKey, correlationId);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.greaterThan(0);

    eventList.events.forEach((userTask) => {
      should(userTask).have.property('key');
      should(userTask).have.property('id');
      should(userTask).have.property('process_instance_id');
      should(userTask).have.property('data');
    });
  });

  it('should fail to retrieve the correlation\'s events, when the user is unauthorized', async () => {

    const processModelKey = 'test_get_events_for_process_model';
    const correlationId = 'correlationId';

    try {
      const processModel = await testFixtureProvider
        .consumerApiClientService
        .getEventsForProcessModelInCorrelation({}, processModelKey, correlationId);

      should.fail('unexpectedSuccessResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  it.skip('should fail to retrieve the correlation\'s events, when the user forbidden to retrieve it', async () => {

    const processModelKey = 'test_get_events_for_process_model';
    const correlationId = 'correlationId';

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      const processModel = await testFixtureProvider
        .consumerApiClientService
        .getEventsForProcessModelInCorrelation(restrictedContext, processModelKey, correlationId);

      should.fail('unexpectedSuccessResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  it.skip('should fail to retrieve a list of events, if the process_model_key does not exist', async () => {

    const invalidProcessModelKey = 'invalidProcessModelKey';
    const correlationId = 'correlationId';

    try {
      const processModel = await testFixtureProvider
        .consumerApiClientService
        .getEventsForProcessModelInCorrelation(consumerContext, invalidProcessModelKey, correlationId);

      should.fail('unexpectedSuccessResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  it.skip('should fail to retrieve a list of events, if the correlation_id does not exist', async () => {

    const processModelKey = 'test_get_events_for_process_model';
    const invalidCorrelationId = 'invalidCorrelationId';

    try {
      const processModel = await testFixtureProvider
        .consumerApiClientService
        .getEventsForProcessModelInCorrelation(consumerContext, processModelKey, invalidCorrelationId);

      should.fail('unexpectedSuccessResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not found/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

});
