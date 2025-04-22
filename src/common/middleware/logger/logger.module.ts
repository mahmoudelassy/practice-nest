import { Logger, Module } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  providers: [],
  exports: [],
})
export class LoggerModule {}
