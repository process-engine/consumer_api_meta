'use strict';

const should = require('should');

const testSetup = require('../../../application/test_setup');

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   GET  ->  /process_models', function() {

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

  it('should return process models through the consumer api', async () => {
    
    const processModelList = await consumerApiClientService.getProcessModels(consumerContext);

    should(processModelList).have.property('process_models');

    should(processModelList.process_models).be.instanceOf(Array);
    should(processModelList.process_models.length).be.greaterThan(0);

    processModelList.process_models.forEach((processModel) => {
      should(processModel).have.property('key');
      should(processModel).have.property('startEvents');
      should(processModel.startEvents).be.instanceOf(Array);
    });
  });

  it('should fail the retrieve a list of process models, when the user is unauthorized', async () => {
    try {
      const processModelList = await consumerApiClientService.getProcessModels({});
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Use different consumerContext
  it.skip('should fail the retrieve a list of process models, when the user forbidden to retrieve it', async () => {
    try {
      const processModelList = await consumerApiClientService.getProcessModels(consumerContext);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

});
