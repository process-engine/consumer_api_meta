'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;

describe('Consumer API:   GET  ->  /process_models/:process_model_id/events', () => {

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

  it('should return a process models events by its process_model_id through the consumer api', async () => {

    const processModelId = 'test_get_events_for_process_model';

    const eventList = await testFixtureProvider
      .consumerApiClientService
      .getEventsForProcessModel(defaultIdentity, processModelId);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.greaterThan(0);

    eventList.events.forEach((userTask) => {
      should(userTask).have.property('id');
      should(userTask).have.property('processInstanceId');
      should(userTask).have.property('data');
    });
  });

  it.skip('should return an empty Array, if the process_model_id does not exist', async () => {

    const invalidprocessModelId = 'invalidprocessModelId';

    const eventList = await testFixtureProvider
      .consumerApiClientService
      .getEventsForProcessModel(defaultIdentity, invalidprocessModelId);

    should(eventList).have.property('events');

    should(eventList.events).be.instanceOf(Array);
    should(eventList.events.length).be.equal(0);
  });

  it('should fail to retrieve the process model\'s events, when the user is unauthorized', async () => {

    const processModelId = 'test_get_events_for_process_model';

    try {
      await testFixtureProvider
        .consumerApiClientService
        .getEventsForProcessModel({}, processModelId);

      should.fail('unexpectedSuccessResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it.skip('should fail to retrieve the process model\'s events, when the user forbidden to retrieve it', async () => {

    const processModelId = 'test_get_events_for_process_model';

    const restrictedIdentity = testFixtureProvider.identities.restrictedUser;

    try {
      await testFixtureProvider
        .consumerApiClientService
        .getEventsForProcessModel(restrictedIdentity, processModelId);

      should.fail('unexpectedSuccessResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

});
