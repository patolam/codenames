import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';
import { timer } from 'rxjs';
import * as moment from 'moment';
import { FormGroup } from '@angular/forms';

const DEFAULT_TIMER = 90;

interface Timer {
  min?: string;
  sec?: string;
  line?: number;
}

@Component({
  selector: 'cdn-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnChanges {
  @Input() state: BoardState;
  @Input() clientId: string;
  @Input() playerForm: FormGroup;
  @Output() startGame: EventEmitter<void> = new EventEmitter();

  @Output() stopGame: EventEmitter<void> = new EventEmitter();
  @Output() clearScore: EventEmitter<void> = new EventEmitter();
  @Output() setTimer: EventEmitter<void> = new EventEmitter();
  @Output() upTimer: EventEmitter<void> = new EventEmitter();

  time: Timer = {};
  lineStyle = {};

  counter = timer(0, 500)
    .subscribe(() => {
      const now = moment().add(-1, 's');
      const start = moment(this.state?.game?.current?.timer);

      const minDiff = start.diff(now, 'm');
      const secDiff = start.diff(now, 's') - (minDiff * 60);

      if (this.state?.game?.current?.timer) {
        if (minDiff >= 0 && secDiff >= 0) {
          this.time = {
            min: minDiff.toString(),
            sec: (secDiff >= 10 ? secDiff : `0${secDiff}`).toString(),
            line: start.diff(now, 's') / DEFAULT_TIMER
          };

          this.lineStyle = {
            width: 'calc(100vw * ' + this.time?.line + ')'
          };
        } else {
          this.upTimer.emit();
        }
      }
    });

  ngOnChanges(changes: SimpleChanges): void {
    const prev: BoardState = changes.state.previousValue;
    const curr: BoardState = changes.state.currentValue;

    if (!prev.game.current.timer && curr.game.current.timer) {
      this.time = {};
      this.lineStyle = {};
    }
  }
}
