import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { StateService } from './state/state.service';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

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

  @Get('/screen')
  getScreen(@Res() res: Response) {
    const data = fs.readFileSync(path.resolve(__dirname, 'assets/screen.png'));

    res.set('Content-Type', 'image/png');
    return res.status(HttpStatus.OK).send(Buffer.from(data));
  }
}
