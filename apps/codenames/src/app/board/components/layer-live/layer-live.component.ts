import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cdn-layer-live',
  templateUrl: './layer-live.component.html',
  styleUrls: ['./layer-live.component.scss']
})
export class LayerLiveComponent implements OnInit {
  @Input() state: BoardState;
  @Input() playerForm: FormGroup;
  @Input() clientId: string;

  @Output() switchAccept: EventEmitter<{
    i: number,
    j: number
  }> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  acceptSwitch(i: number, j: number): void {
    this.switchAccept.emit({ i, j });
  };

  getAcceptedValue(col: number, row: number): number {
    return Object.values(this.state?.game?.accept)
      .filter((coords: [number, number]) => coords[0] === col && coords[1] === row).length;
  }
}
