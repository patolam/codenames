import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoardState } from '../../../../../../shared/model/state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cdn-dialog-moves',
  templateUrl: './dialog-moves.component.html',
  styleUrls: ['./dialog-moves.component.scss']
})
export class DialogMovesComponent implements OnInit {
  state: BoardState;
  playerForm: FormGroup;
  movesForm: FormGroup;

  items: number[];

  constructor(
    public dialogRef: MatDialogRef<DialogMovesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.state = data.state;
    this.playerForm = data.playerForm;
  }

  ngOnInit(): void {
    this.items = [];

    for (let i = 0; i < this.getMax(); i++) {
      this.items.push(i + 1);
    }

    this.movesForm = this.formBuilder.group({
      word: ['',
        [
          Validators.minLength(2),
          Validators.pattern('^[A-Za-z]+$')
        ]
      ],
    });
  }

  private getMax(): number {
    return this.playerForm.get('team').value === 'Red'
      ? this.state?.game?.leaders?.red?.cardsLeft
      : this.state?.game?.leaders?.blue?.cardsLeft;
  }
}
