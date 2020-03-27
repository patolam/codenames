import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoardState } from '../../../../../../shared/model/state';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cdn-dialog-moves',
  templateUrl: './dialog-moves.component.html',
  styleUrls: ['./dialog-moves.component.scss']
})
export class DialogMovesComponent implements OnInit {
  state: BoardState;
  playerForm: FormGroup;

  items: number[];

  constructor(
    public dialogRef: MatDialogRef<DialogMovesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.state = data.state;
    this.playerForm = data.playerForm;
  }

  ngOnInit(): void {
    this.items = [];

    for (let i = 0; i < this.getMax(); i++) {
      this.items.push(i + 1);
    }
  }

  private getMax(): number {
    return this.playerForm.get('team').value === 'Red'
      ? this.state?.game?.leaders?.red?.cardsLeft
      : this.state?.game?.leaders?.blue?.cardsLeft;
  }
}
