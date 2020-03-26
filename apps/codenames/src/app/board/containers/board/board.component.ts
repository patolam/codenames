import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { BoardState, Player, Team } from '../../../../../../shared/model/state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

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
  teams = [Team.Red, Team.Blue];

  playerForm: FormGroup;

  image: any;

  constructor(
    private socket: Socket,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
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
      console.log(this.clientId);
    });

    this.playerForm = this.formBuilder.group({
      name: [''],
      team: [Team.Red]
    });

    this.state$.subscribe((state: BoardState) => {
      this.state = state;

      console.log(state);

      if (this.state?.game && !this.state?.game.winner) {
        this.playerForm.disable();
      } else {
        this.playerForm.enable();
      }

      if (this.state?.game?.winner) {
        this.snackBar.open(
          `Game over! The winner is: ${this.state.game.winner} team!`,
          'Close',
          {
            duration: 10000
          }
        );
      }
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

  movesAccept(value: number) {
    this.socket.emit('movesAccept', {
      boardId: this.boardId,
      value
    });
  }

  moveNext(col: number, row: number): void {
    this.socket.emit('moveNext', {
      boardId: this.boardId,
      col,
      row
    });
  }
}
