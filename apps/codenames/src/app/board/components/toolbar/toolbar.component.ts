import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';
import { timer } from 'rxjs';
import * as moment from 'moment';
import { FormGroup } from '@angular/forms';

interface Timer {
  min?: string,
  sec?: string
}

@Component({
  selector: 'cdn-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() state: BoardState;
  @Input() clientId: string;
  @Input() playerForm: FormGroup;

  @Output() startGame: EventEmitter<void> = new EventEmitter();
  @Output() stopGame: EventEmitter<void> = new EventEmitter();
  @Output() clearScore: EventEmitter<void> = new EventEmitter();
  @Output() setTimer: EventEmitter<void> = new EventEmitter();
  @Output() upTimer: EventEmitter<void> = new EventEmitter();

  time: Timer = {};

  counter = timer(0, 200)
    .subscribe(() => {
      const now = moment();
      const start = moment(this.state?.game?.current?.timer);

      const minDiff = start.diff(now, 'm');
      const secDiff = start.diff(now, 's') - (minDiff * 60);

      if (this.state?.game?.current?.timer) {
        if (minDiff >= 0 && secDiff >= 0) {
          this.time = {
            min: minDiff.toString(),
            sec: (secDiff >= 10 ? secDiff : `0${secDiff}`).toString()
          };
        } else {
          this.upTimer.emit();
        }
      }
    });
}
