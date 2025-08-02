import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PinoLogger extends Logger {
  log(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]) {
    super.fatal(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    super.error(message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(message, ...optionalParams);
  }
}
