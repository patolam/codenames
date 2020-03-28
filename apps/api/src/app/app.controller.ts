import { Controller, Get } from '@nestjs/common';
import { StateService } from './state/state.service';

@Controller()
export class AppController {
  constructor(
    private stateService: StateService
  ) {
  }

  @Get('/hello')
  hello() {
    return { msg: 'hello' };
  }

  @Get('/id')
  getId(): { id: string } {
    return this.stateService.getRandId();
  }
}
