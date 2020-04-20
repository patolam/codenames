import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogMovesComponent } from '../../dialogs/dialog-moves/dialog-moves.component';

@Component({
  selector: 'cdn-layer-game',
  templateUrl: './layer-game.component.html',
  styleUrls: ['./layer-game.component.scss']
})
export class LayerGameComponent implements OnChanges {
  @Input() state: BoardState;
  @Input() playerForm: FormGroup;

  @Output() movesAccept: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const prev: BoardState = changes.state?.previousValue;
    const curr: BoardState = changes.state?.currentValue;

    if (prev?.game?.current?.timer && !curr?.game?.current?.timer) {
      this.dialog.closeAll();
    }
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
