'use strict';

const should = require('should');

const TestFixtureProvider = require('../../dist/commonjs').TestFixtureProvider;

describe.skip('Consumer API: POST  ->  /process_models/:process_model_id/correlations/:correlation_id/events/:event_id/trigger', () => {

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

  it('should successfully trigger the given event.', async () => {

    // TODO: Replace with real values
    const processModelId = 'test_consumer_api_trigger_event';
    const correlationId = 'correlationId';
    const eventId = 'test_event_to_trigger';
    const eventTriggerPayload = {};

    await testFixtureProvider
      .consumerApiClientService
      .triggerMessageEvent(defaultIdentity, processModelId, correlationId, eventId, eventTriggerPayload);
  });

  it('should fail trigger the event, when the user is unauthorized', async () => {

    const processModelId = 'test_consumer_api_trigger_event';
    const correlationId = 'correlationId';
    const eventId = 'test_event_to_trigger';
    const eventTriggerPayload = {};

    try {
      await testFixtureProvider
        .consumerApiClientService
        .triggerMessageEvent({}, processModelId, correlationId, eventId, eventTriggerPayload);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail trigger the event, when the user forbidden to retrieve it', async () => {

    const processModelId = 'test_consumer_api_trigger_event';
    const correlationId = 'correlationId';
    const eventId = 'test_event_to_trigger';
    const eventTriggerPayload = {};

    const restrictedIdentity = testFixtureProvider.identities.restrictedUser;

    try {
      await testFixtureProvider
        .consumerApiClientService
        .triggerMessageEvent(restrictedIdentity, processModelId, correlationId, eventId, eventTriggerPayload);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to trigger the event, if the given process_model_id does not exist', async () => {

    // TODO: Replace with real values
    const processModelId = 'invalidprocessModelId';
    const correlationId = 'correlationId';
    const eventId = 'test_event_to_trigger';
    const eventTriggerPayload = {};

    try {
      await testFixtureProvider
        .consumerApiClientService
        .triggerMessageEvent(defaultIdentity, processModelId, correlationId, eventId, eventTriggerPayload);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /process model id not found/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to trigger the event, if the given correlation_id does not exist', async () => {

    // TODO: Replace with real values
    const processModelId = 'test_consumer_api_trigger_event';
    const correlationId = 'invalidcorrelation';
    const eventId = 'test_event_to_trigger';
    const eventTriggerPayload = {};

    try {
      await testFixtureProvider
        .consumerApiClientService
        .triggerMessageEvent(defaultIdentity, processModelId, correlationId, eventId, eventTriggerPayload);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /process model id not found/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

  it('should fail to trigger the event, if the given event_id does not exist', async () => {

    // TODO: Replace with real values
    const processModelId = 'test_consumer_api_trigger_event';
    const correlationId = 'correlationId';
    const invalidEventId = 'invalidEventId';
    const eventTriggerPayload = {};

    try {
      await testFixtureProvider
        .consumerApiClientService
        .triggerMessageEvent(defaultIdentity, processModelId, correlationId, invalidEventId, eventTriggerPayload);

      should.fail('unexpectedSuccesResult', undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /user task id not found/i;
      should(error.code).be.match(expectedErrorCode);
      should(error.message).be.match(expectedErrorMessage);
    }
  });

});
