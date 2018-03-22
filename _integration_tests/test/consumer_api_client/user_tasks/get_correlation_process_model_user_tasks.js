'use strict';

const should = require('should');

const testSetup = require('../../../application/test_setup');

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   GET  ->  /process_models/:process_model_key/correlations/:correlation_id/user_tasks', function() {

  let httpBootstrapper;
  let consumerApiClientService;
  let consumerContext;
  
  this.timeout(testTimeoutMilliseconds);

  before(async () => {
    httpBootstrapper = await testSetup.initializeBootstrapper();
    await httpBootstrapper.start();
    consumerContext = await testSetup.createContext();
    consumerApiClientService = await testSetup.resolveAsync('ConsumerApiClientService');
  });

  after(async () => {
    await httpBootstrapper.reset();
    await httpBootstrapper.shutdown();
  });

  it('should return a list of user tasks for a given process model in a given correlation', async () => {

    const processModelKey = 'test_get_user_tasks';
    const correlationId = 'correlationId';
    
    const userTaskList = await consumerApiClientService.getUserTasksForProcessModelInCorrelation(consumerContext, processModelKey, correlationId);

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

  it('should fail to retrieve the correlation\'s user tasks, when the user is unauthorized', async () => {

    const processModelKey = 'test_get_user_tasks';
    const correlationId = 'correlationId';
    
    try {
      const userTaskList = await consumerApiClientService.getUserTasksForProcessModelInCorrelation({}, processModelKey, correlationId);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Use different consumerContext
  it.skip('should fail to retrieve the correlation\'s user tasks, when the user forbidden to retrieve it', async () => {

    const processModelKey = 'test_get_user_tasks';
    const correlationId = 'correlationId';
    
    try {
      const userTaskList = await consumerApiClientService.getUserTasksForProcessModelInCorrelation(consumerContext, processModelKey, correlationId);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  it.skip('should fail to retrieve a list of user tasks, if the process_model_key does not exist', async () => {

    const invalidProcessModelKey = 'invalidProcessModelKey';
    const correlationId = 'correlationId';
    
    try {
      const processModel = await consumerApiClientService.getUserTasksForProcessModelInCorrelation(consumerContext, invalidProcessModelKey, correlationId);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not found/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  it.skip('should fail to retrieve a list of user tasks, if the correlation_id does not exist', async () => {

    const processModelKey = 'test_get_user_tasks';
    const invalidCorrelationId = 'invalidCorrelationId';
    
    try {
      const processModel = await consumerApiClientService.getUserTasksForProcessModelInCorrelation(consumerContext, processModelKey, invalidcorrelationId);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not found/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

});
