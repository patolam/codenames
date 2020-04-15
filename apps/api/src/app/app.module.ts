import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { StateModule } from './state/state.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [StateModule, LogsModule],
  controllers: [AppController],
  providers: [AppService, AppGateway]
})
export class AppModule {
}
