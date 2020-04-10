import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cdn-layer-live',
  templateUrl: './layer-live.component.html',
  styleUrls: ['./layer-live.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayerLiveComponent implements OnInit {
  @Input() state: BoardState;
  @Input() playerForm: FormGroup;
  @Input() clientId: string;

  coreBoard: any[][];

  @Output() switchAccept: EventEmitter<{
    i: number,
    j: number
  }> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    this.coreBoard = this.simpleBoardFactory(0);
  }

  acceptSwitch(i: number, j: number): void {
    this.switchAccept.emit({ i, j });
  };

  getAcceptedValue(col: number, row: number): number {
    return Object.values(this.state?.game?.accept || {})
      .filter((coords: [number, number]) => coords[0] === col && coords[1] === row).length;
  }

  /* TODO duplicate code */
  private simpleBoardFactory = (value: any): any[][] => {
    const board: any[] = [];

    for (let i = 0; i < 5; i++) {
      board.push(value);
    }

    const result: any[][] = [];

    for (let i = 0; i < 5; i++) {
      result.push([...board]);
    }

    return result;
  };
}
