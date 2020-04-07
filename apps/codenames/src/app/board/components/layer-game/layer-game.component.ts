import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogMovesComponent } from '../../dialogs/dialog-moves/dialog-moves.component';

@Component({
  selector: 'cdn-layer-game',
  templateUrl: './layer-game.component.html',
  styleUrls: ['./layer-game.component.scss']
})
export class LayerGameComponent implements OnInit {
  @Input() state: BoardState;
  @Input() playerForm: FormGroup;

  @Output() movesAccept: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogMovesComponent, {
      width: '300px',
      panelClass: 'dialog',
      data: {
        state: this.state,
        playerForm: this.playerForm
      }
    });

    dialogRef.afterClosed().subscribe((move) => {
      this.movesAccept.emit(move);
    });
  }

}
