import { Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { BoardState, Player, Team } from '../../../../../../shared/model/state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogPlayerComponent } from '../../dialogs/dialog-player/dialog-player.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogEndGameComponent } from '../../dialogs/dialog-end-game/dialog-end-game.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { Tab } from '../../model/tabs';

@Component({
  selector: 'cdn-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @ViewChild(ChatComponent, { static: false }) chat: ChatComponent;

  state$: Observable<BoardState>;
  clientId: string;
  boardId: string;

  state: BoardState;
  playerForm: FormGroup;

  tabs: Tab[] = [
    Tab.Chat,
    Tab.Board
  ];
  tab: Tab;

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

    this.tab = this.tabs[0];
  }

  ngOnInit(): void {
    this.socket.on('connect', () => {
      this.clientId = this.socket.ioSocket.id;
      this.socket.emit('returnState', { boardId: this.boardId });

      this.openDialog();
    });

    this.playerForm = this.formBuilder.group({
      name: ['',
        [
          Validators.minLength(3),
          Validators.pattern('^[^\\s]+(\\s+[^\\s]+)*$')
        ]
      ],
      team: [Team.Red]
    });

    this.state$.subscribe((state: BoardState) => {
      this.state = state;

      if (this.state?.game && Object.keys(this.state?.players).includes(this.clientId)) {
        this.playerForm.disable();
      } else {
        this.playerForm.enable();
      }

      if (this.state?.event?.endGame === true) {
        this.openDialogEndGame();
      }
      if (this.state?.event?.textSend === true) {
        this.chat?.scrollToEnd();
      }
      if (this.state?.event?.startGame === true) {
        if (state?.game?.leaders?.blue?.id === this.clientId || state?.game?.leaders?.red?.id === this.clientId) {
          this.tab = this.tabs[1];
        }
      }
      if (this.state?.event?.stopGame === true) {
        this.tab = this.tabs[0];
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
      },
      disableClose: true
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

  textSend(text: string) {
    this.socket.emit('textSend', {
      boardId: this.boardId,
      text
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
