import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { AppState, Player, Team } from '../../../../../../shared/model/state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  state$: Observable<AppState> = this.socket.fromEvent<AppState>('state');

  state: AppState;
  teams = [Team.Red, Team.Blue];

  playerForm: FormGroup;

  constructor(
    private socket: Socket,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.playerForm = this.formBuilder.group({
      name: [''],
      team: [Team.Red]
    });

    this.state$.subscribe((state: AppState) => {
      this.state = state;

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

  emit(player: Player) {
    this.socket.emit('player', player);
  }

  startGame() {
    this.socket.emit('startGame');
  }

  stopGame() {
    this.socket.emit('stopGame');
  }

  clearScore() {
    this.socket.emit('clearScore');
  }

  acceptMoves(value: number) {
    this.socket.emit('acceptMoves', value);
  }

  tileClicked(col: number, row: number): void {
    this.socket.emit('nextMove', { col, row });
  }
}
