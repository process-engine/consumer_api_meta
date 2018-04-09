'use strict';

const should = require('should');

const testSetup = require('../../../application/test_setup');

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   GET  ->  /process_models/:process_model_key', function() {

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

  it('should return a process model by its process_model_key through the consumer api', async () => {

    const processModelKey = 'test_consumer_api_process_start';

    const processModel = await consumerApiClientService.getProcessModelByKey(consumerContext, processModelKey);
    should(processModel).have.property('key');
    should(processModel).have.property('startEvents');
  });

  it('should fail to retrieve the process model, when the user is unauthorized', async () => {

    const processModelKey = 'test_consumer_api_process_start';

    try {
      const processModel = await consumerApiClientService.getProcessModelByKey({}, processModelKey);
      should.fail(processModel, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the process model, when the user forbidden to retrieve it', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const restrictedContext = await testSetup.createRestrictedContext();

    try {
      const processModel = await consumerApiClientService.getProcessModelByKey(restrictedContext, processModelKey);
      should.fail(processModel, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  it('should fail to retrieve the process model, if the process_model_key does not exist', async () => {

    const invalidProcessModelKey = 'invalidProcessModelKey';
    
    try {
      const processModel = await consumerApiClientService.getProcessModelByKey(consumerContext, invalidProcessModelKey);
      should.fail(processModel, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /not found/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

});
