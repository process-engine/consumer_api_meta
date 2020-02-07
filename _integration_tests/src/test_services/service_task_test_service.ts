import {Logger} from 'loggerhythm';

const logger: Logger = Logger.createLogger('service_task:service_task_test_bnservice');

export class ServiceTaskTestService {

  public async delay(timeInSeconds: number, valueToReturn: any): Promise<any> {
    logger.info('Starting Service: Delay');
    logger.info(`Waiting ${timeInSeconds} seconds.`);

    const millisecondsToWait = timeInSeconds * 1000;

    await new Promise((resolve: Function): void => {
      setTimeout((): void => {
        logger.info('Timeout over');
        resolve();
      }, millisecondsToWait);
    });

    return valueToReturn;
  }

}
