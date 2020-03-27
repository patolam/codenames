import { Component, Inject, OnInit } from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cdn-dialog-end-game',
  templateUrl: './dialog-end-game.component.html',
  styleUrls: ['./dialog-end-game.component.scss']
})
export class DialogEndGameComponent implements OnInit {
  state: BoardState;

  constructor(
    public dialogRef: MatDialogRef<DialogEndGameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.state = data.state;
  }

  ngOnInit(): void {
  }

}
