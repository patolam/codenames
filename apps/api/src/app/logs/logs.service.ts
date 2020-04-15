import { Injectable } from '@nestjs/common';
import * as SimpleNodeLogger from 'simple-node-logger';

const LOGS_OPTIONS = {
  errorEventName: 'error',
  logDirectory: 'logs',
  fileNamePattern: 'log-<DATE>.log',
  dateFormat: 'YYYY-MM-DD'
};

@Injectable()
export class LogsService {
  private log;

  constructor() {
    this.log = SimpleNodeLogger.createRollingFileLogger(LOGS_OPTIONS);
  }

  info(text: string) {
    this.write(text);
  }

  private write(text: string) {
    this.log.info(text);
  }
}
