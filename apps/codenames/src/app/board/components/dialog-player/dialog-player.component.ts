import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoardState, Team } from '../../../../../../shared/model/state';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cdn-player-dialog',
  templateUrl: './dialog-player.component.html',
  styleUrls: ['./dialog-player.component.scss']
})
export class DialogPlayerComponent {
  teams = [Team.Red, Team.Blue];

  state: BoardState;
  playerForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.state = data.state;
    this.playerForm = data.playerForm;
  }
}
