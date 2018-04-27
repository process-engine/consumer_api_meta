'use strict';

const should = require('should');

const TestFixtureProvider = require('../../../dist/commonjs/test_fixture_provider').TestFixtureProvider;

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   GET  ->  /process_models/:process_model_key/user_tasks', function getUserTasksForProcessModel() {

  let testFixtureProvider;
  let laneUserContext;

  this.timeout(testTimeoutMilliseconds);

  before(async () => {
    testFixtureProvider = new TestFixtureProvider();
    await testFixtureProvider.initializeAndStart();
    laneUserContext = testFixtureProvider.context.laneUser;
  });

  after(async () => {
    await testFixtureProvider.tearDown();
  });

  it('should return a process model\'s user tasks by its process_model_key through the consumer api', async () => {

    const processModelKey = 'consumer_api_lane_test';

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    const userTaskList = await testFixtureProvider
      .consumerApiClientService
      .getUserTasksForProcessModel(laneUserContext, processModelKey);

    should(userTaskList).have.property('user_tasks');
    should(userTaskList.user_tasks).be.instanceOf(Array);
    should(userTaskList.user_tasks.length).be.greaterThan(0);

    userTaskList.user_tasks.forEach((userTask) => {
      should(userTask).have.property('key');
      should(userTask).have.property('id');
      should(userTask).have.property('process_instance_id');
      should(userTask).have.property('data');
    });
  });

  it('should fail to retrieve the process model\'s user tasks, when the user is unauthorized', async () => {

    const processModelKey = 'test_consumer_api_process_start';

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForProcessModel({}, processModelKey);

      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the process model\'s user tasks, when the user forbidden to retrieve it', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const restrictedContext = testFixtureProvider.context.restrictedUser;

    try {
      const userTaskList = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForProcessModel(restrictedContext, processModelKey);

      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i;
      should(error.code)
        .match(expectedErrorCode);
      should(error.message)
        .match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the process model\'s user tasks, if the process_model_key does not exist', async () => {

    const invalidProcessModelKey = 'invalidProcessModelKey';

    try {
      const processModel = await testFixtureProvider
        .consumerApiClientService
        .getUserTasksForProcessModel(laneUserContext, invalidProcessModelKey);

      should.fail(processModel, undefined, 'This request should have failed!');
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
