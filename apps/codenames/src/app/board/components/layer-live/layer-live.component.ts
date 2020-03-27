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

  @Output() nextMove: EventEmitter<{i: number, j: number}> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  moveNext(i: number, j: number) {
    this.nextMove.emit({i,  j});
  };
}
