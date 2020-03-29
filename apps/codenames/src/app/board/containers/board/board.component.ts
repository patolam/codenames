import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { BoardState, Player, Team } from '../../../../../../shared/model/state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogPlayerComponent } from '../../components/dialog-player/dialog-player.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogEndGameComponent } from '../../components/dialog-end-game/dialog-end-game.component';

interface Tile {
  id: number;
  word: any;
}

@Component({
  selector: 'cdn-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  state$: Observable<BoardState>;
  clientId: string;
  boardId: number;

  state: BoardState;

  playerForm: FormGroup;

  constructor(
    private socket: Socket,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    route.params.subscribe(({ id }) => {
      this.boardId = id;
      this.state$ = this.socket.fromEvent<BoardState>(id);
    });
  }

  ngOnInit(): void {
    this.socket.on('connect', () => {
      this.clientId = this.socket.ioSocket.id;
      this.socket.emit('returnState', { boardId: this.boardId });

      this.openDialog();
    });

    this.playerForm = this.formBuilder.group({
      name: [''],
      team: [Team.Red]
    });

    this.state$.subscribe((state: BoardState) => {
      this.state = state;

      if (this.state?.game && !this.state?.game.winner) {
        this.playerForm.disable();
      } else {
        this.playerForm.enable();
      }

      if (this.state?.event?.endGame === true) {
        this.openDialogEndGame();
      }
    });
  }

  openDialogEndGame(): void {
    const dialogRef = this.dialog.open(DialogEndGameComponent, {
      width: '400px',
      panelClass: 'dialog',
      data: {
        state: this.state
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogPlayerComponent, {
      width: '300px',
      panelClass: 'dialog',
      data: {
        playerForm: this.playerForm
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.playerUpdate(this.playerForm.value);
    });
  }

  playerUpdate(player: Player) {
    this.socket.emit('playerUpdate', {
      boardId: this.boardId,
      player
    });
  }

  gameStart() {
    this.socket.emit('gameStart', {
      boardId: this.boardId
    });
  }

  gameStop() {
    this.socket.emit('gameStop', {
      boardId: this.boardId
    });
  }

  scoreClear() {
    this.socket.emit('scoreClear', {
      boardId: this.boardId
    });
  }

  movesAccept(move: { wordsNo: number; word: string }) {
    this.socket.emit('movesAccept', {
      boardId: this.boardId,
      move
    });
  }

  acceptSwitch(col: number, row: number): void {
    this.socket.emit('acceptSwitch', {
      boardId: this.boardId,
      col,
      row
    });
  }
}
