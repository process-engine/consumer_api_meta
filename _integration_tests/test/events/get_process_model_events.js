'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   GET  ->  /process_models/:process_model_key/events', function getProcessModelEvent() {

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

  it('should return a process models events by its process_model_key through the consumer api', async () => {

    const processModelKey = 'test_get_events_for_process_model';

    const eventList = await testFixtureProvider
      .consumerApiClientService
      .getEventsForProcessModel(consumerContext, processModelKey);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.greaterThan(0);

    eventList.events.forEach((userTask) => {
      should(userTask).have.property('key');
      should(userTask).have.property('id');
      should(userTask).have.property('processInstanceId');
      should(userTask).have.property('data');
    });
  });

  it('should fail to retrieve the process model\'s events, when the user is unauthorized', async () => {

    const processModelKey = 'test_get_events_for_process_model';

    try {
      const eventList = await testFixtureProvider
        .consumerApiClientService
        .getEventsForProcessModel({}, processModelKey);

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
  it.skip('should fail to retrieve the process model\'s events, when the user forbidden to retrieve it', async () => {

    const processModelKey = 'test_get_events_for_process_model';

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      const eventList = await testFixtureProvider
        .consumerApiClientService
        .getEventsForProcessModel(restrictedContext, processModelKey);

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
  it.skip('should fail to retrieve the process model\'s events, if the process_model_key does not exist', async () => {

    const invalidProcessModelKey = 'invalidProcessModelKey';

    try {
      const processModel = await testFixtureProvider
        .aconsumerApiClientService
        .getEventsForProcessModel(consumerContext, invalidProcessModelKey);

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
