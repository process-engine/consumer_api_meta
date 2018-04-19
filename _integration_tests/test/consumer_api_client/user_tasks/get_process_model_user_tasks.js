'use strict';

const should = require('should');

const testSetup = require('../../../test_setup');

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   GET  ->  /process_models/:process_model_key/user_tasks', function() {

  let httpBootstrapper;
  let consumerApiClientService;
  let consumerContext;
  
  this.timeout(testTimeoutMilliseconds);

  before(async function() {
    this.timeout(0);
    httpBootstrapper = await testSetup.initializeBootstrapper();
    await httpBootstrapper.start();
    consumerContext = await testSetup.createContext();
    consumerApiClientService = await testSetup.resolveAsync('ConsumerApiClientService');
  });

  after(async function() {
    this.timeout(0);
    await httpBootstrapper.reset();
    await httpBootstrapper.shutdown();
  });

  it('should return a process model\'s user tasks by its process_model_key through the consumer api', async () => {

    const processModelKey = 'consumer_api_lane_test';
    const laneContext = await testSetup.createLaneContext();

    await consumerApiClientService.startProcess(laneContext, processModelKey, 'StartEvent_1');

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300);
    });

    const userTaskList = await consumerApiClientService.getUserTasksForProcessModel(laneContext, processModelKey);

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
      const userTaskList = await consumerApiClientService.getUserTasksForProcessModel({}, processModelKey);
      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the process model\'s user tasks, when the user forbidden to retrieve it', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const restrictedContext = await testSetup.createRestrictedContext();
    
    try {
      const userTaskList = await consumerApiClientService.getUserTasksForProcessModel(restrictedContext, processModelKey);
      should.fail(userTaskList, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the process model\'s user tasks, if the process_model_key does not exist', async () => {

    const invalidProcessModelKey = 'invalidProcessModelKey';
    
    try {
      const processModel = await consumerApiClientService.getUserTasksForProcessModel(consumerContext, invalidProcessModelKey);
      should.fail(processModel, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not found/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

});
