import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cdn-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() state: BoardState;
  @Input() playerForm: FormGroup;
  @Input() boardId: string;

  @Output() openDialog: EventEmitter<void> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onDialogOpen(): void {
    this.openDialog.emit();
  }
}
