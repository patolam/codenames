import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/hello')
  hello() {
    return { msg: 'hello' };
  }

}
