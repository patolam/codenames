import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { AppService } from '../app.service';

@Module({
  imports: [],
  controllers: [],
  providers: [StateService, AppService],
  exports: [StateService],
})
export class StateModule {
}
