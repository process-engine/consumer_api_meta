'use strict';

const should = require('should');

const returnOnOptions = require('@process-engine/consumer_api_contracts').ProcessStartReturnOnOptions;

const testSetup = require('../../../application/test_setup');

const testTimeoutMilliseconds = 5000;

describe('Consumer API:   POST  ->  /process_models/:process_model_key/start_events/:start_event_key/start', function() {

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

  it('should start the process and return the correlation ID (return_on = on_process_instance_started)', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'randomcorrelationid',
      input_values: {},
    };
    const returnOn = returnOnOptions.onProcessInstanceStarted;
    
    const result = await consumerApiClientService.startProcess(consumerContext, processModelKey, startEventKey, payload, returnOn);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.equal(payload.correlation_id);
  });

  it('should start the process and return the correlation ID (return_on = on_process_instance_finished)', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {},
    };
    const returnOn = returnOnOptions.onProcessInstanceFinished;
    
    const result = await consumerApiClientService.startProcess(consumerContext, processModelKey, startEventKey, payload, returnOn);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.equal(payload.correlation_id);
  });

  it('should start the process and return a generated correlation ID, after the given end event was reached', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      input_values: {},
    };
    const returnOn = returnOnOptions.onProcessInstanceStarted;
    
    const result = await consumerApiClientService.startProcess(consumerContext, processModelKey, startEventKey, payload, returnOn);

    should(result).have.property('correlation_id');
    should(result.correlation_id).be.a.String();
  });

  it('should fail to start the process, when the user is unauthorized', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {
        causeError: true,
      },
    };
    
    const returnOn = returnOnOptions.onProcessInstanceStarted;

    try {
      const result = await consumerApiClientService.startProcess({}, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 401;
      const expectedErrorMessage = /no auth token provided/i;
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Use different consumerContext
  it.skip('should fail to start the process, when the user forbidden to retrieve it', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {
        causeError: true,
      },
    };
    
    const returnOn = returnOnOptions.onProcessInstanceStarted;

    try {
      const result = await consumerApiClientService.startProcess(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 403;
      const expectedErrorMessage = /not allowed/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  it.skip('should fail to start the process, if the given process_model_key does not exist', async () => {

    const processModelKey = 'invalidProcessModelKey';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {},
    };

    const returnOn = returnOnOptions.onProcessInstanceStarted;

    try {
      const result = await consumerApiClientService.startProcess(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /process model key not found/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  it.skip('should fail to start the process, if the given start_event_key does not exist', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'invalidStartEventKey';
    const payload = {
      correlation_id: 'string',
      input_values: {},
    };
    
    const returnOn = returnOnOptions.onProcessInstanceStarted;

    try {
      const result = await consumerApiClientService.startProcess(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 404;
      const expectedErrorMessage = /start event not found/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  it.skip('should fail to start the process, if the given return_on parameter is invalid', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {},
    };
    
    const returnOn = 'invalid_return_on_param';

    try {
      const result = await consumerApiClientService.startProcess(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 400;
      const expectedErrorMessage = /invalid return option/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  it.skip('should fail to start the process, if the given payload is invalid', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = 'i am missing vital properties';
    
    const returnOn = returnOnOptions.onProcessInstanceStarted;

    const consumerContext = await testSetup.createContext('user');

    try {
      const result = await consumerApiClientService.startProcess(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 400;
      const expectedErrorMessage = /invalid payload/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  // TODO: Find a way to simulate a process error
  it.skip('should fail, if starting the request caused an error', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {},
    };
    
    const returnOn = returnOnOptions.onProcessInstanceStarted;

    try {
      const result = await consumerApiClientService.startProcess(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 500;
      const expectedErrorMessage = /could not be started/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

  // TODO: Bad Path not implemented yet
  // TODO: Find a way to simulate a process error
  it.skip('should fail, if the request was aborted before the desired return_on event was reached', async () => {

    const processModelKey = 'test_consumer_api_process_start';
    const startEventKey = 'StartEvent_1';
    const payload = {
      correlation_id: 'string',
      input_values: {
        causeError: true,
      },
    };
    
    const returnOn = returnOnOptions.onProcessInstanceStarted;

    try {
      const result = await consumerApiClientService.startProcess(consumerContext, processModelKey, startEventKey, payload, returnOn);
      should.fail(result, undefined, 'This request should have failed!');
    } catch (error) {
      const expectedErrorCode = 500;
      const expectedErrorMessage = /critical error/i
      should(error.code).match(expectedErrorCode);
      should(error.message).match(expectedErrorMessage);
    }
  });

});