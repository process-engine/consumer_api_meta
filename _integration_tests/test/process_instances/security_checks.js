'use strict';

const should = require('should');
const uuid = require('uuid');

const StartCallbackType = require('@process-engine/consumer_api_contracts').StartCallbackType;

const TestFixtureProvider = require('../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testCase = 'Consumer API:   POST  ->  /process_models/:process_model_key/start_events/:start_event_key/start';
describe(`Consumer API: ${testCase}`, () => {

  let testFixtureProvider;

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should fail to start the process, when the user is unauthorized', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {
        causeError: true,
      },
    };

    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance({}, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to execute a process without sublanes, if the user cannot access the lane with the start event', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlationId: uuid.v4(),
      inputValues: {
        causeError: true,
      },
    };

    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(restrictedContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to execute a process with sublanes, if the user subscribed to an end event he cannot access', async () => {
    const processModelKey = 'test_consumer_api_sublane_process';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'EndEvent_2';

    const payload = {
      inputValues: {
        test_config: 'different_lane',
      },
    };

    const userContext = testFixtureProvider.context.userWithAccessToSubLaneC;

    const startCallbackType = StartCallbackType.CallbackOnEndEventReached;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(userContext, processModelKey, startEventKey, payload, startCallbackType, endEventKey);

      should.fail(result, undefined, 'This request should have failed!');

    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not found/i;

      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to start a process with sublanes, if the user cannot access the root lane.', async () => {
    const processModelKey = 'test_consumer_api_sublane_process';
    const startEventKey = 'Start_Event_1';

    const payload = {
      inputValues: {
        test_config: 'different_lane',
      },
    };

    const userContext = testFixtureProvider.context.userWithNoAccessToLaneA;
    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(userContext, processModelKey, startEventKey, payload, startCallbackType);

      should.fail(result, undefined, 'The user can execute the process even if he has no access rights to the parent lane.');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;

      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to start a process with sublanes, if the user cannot access the sublanes.', async () => {
    const processModelKey = 'test_consumer_api_sublane_process';
    const startEventKey = 'StartEvent_1';
    const endEventKey = 'EndEvent_1';

    const payload = {
      inputValues: {
        test_config: 'same_lane',
      },
    };

    const startCallbackType = StartCallbackType.CallbackOnProcessInstanceFinished;

    const userContext = testFixtureProvider.context.userWithAccessToLaneA;

    try {
      const result = await testFixtureProvider
        .consumerApiClientService
        .startProcessInstance(userContext, processModelKey, startEventKey, payload, startCallbackType, endEventKey);

      should.fail(result, undefined, 'The restricted user should not be able to execute the process inside the sublane');

    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /access denied/i;

      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });
});
