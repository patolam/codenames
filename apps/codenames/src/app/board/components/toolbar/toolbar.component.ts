import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';

@Component({
  selector: 'cdn-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() state: BoardState;
  @Input() clientId: string;

  @Output() startGame: EventEmitter<void> = new EventEmitter();
  @Output() stopGame: EventEmitter<void> = new EventEmitter();
  @Output() clearScore: EventEmitter<void> = new EventEmitter();
}
