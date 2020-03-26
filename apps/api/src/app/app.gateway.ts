import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { BoardState, Game, Player, Team } from '../../../shared/model/state';
import * as _ from 'lodash';
import { AppService } from './app.service';
import { StateService } from './state/state.service';

@WebSocketGateway(90)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('AppGateway');

  private readonly boards: { [key: string]: BoardState };

  constructor(
    private appService: AppService,
    private stateService: StateService
  ) {
    this.boards = stateService.appState.boards;
  }

  @SubscribeMessage('returnState')
  returnState(client: Socket, data: { boardId: string }): void {
    this.server.emit(data.boardId, this.stateService.returnState(data));
  }

  @SubscribeMessage('playerUpdate')
  playerUpdate(
    client: Socket,
    data: { boardId: string; player: Player }
  ): void {
    this.server.emit(
      data.boardId,
      this.stateService.playerUpdate(client.id, data)
    );
  }

  @SubscribeMessage('gameStart')
  gameStart(client: Socket, data: { boardId: string }): void {
    const players = { ...this.boards[data.boardId].players };

    const redId: string = this.appService.getNextLeader(players, Team.Red);
    const blueId: string = this.appService.getNextLeader(players, Team.Blue);

    if (redId) {
      players[redId].leadNo++;
    }

    if (blueId) {
      players[blueId].leadNo++;
    }

    const nextTeam: Team =
      blueId && redId ? _.sample(Team) : redId ? Team.Red : Team.Blue;

    const game: Game = {
      startTeam: nextTeam,
      leaders: {
        red: {
          id: redId,
          cardsLeft: nextTeam === Team.Red ? 9 : 8
        },
        blue: {
          id: blueId,
          cardsLeft: nextTeam === Team.Blue ? 9 : 8
        }
      },
      current: {
        team: nextTeam,
        wordsNo: null
      },
      layers: {
        live: this.appService.getLiveBoard(),
        words: this.appService.getWordsBoard(),
        game: this.appService.getGameBoard(nextTeam)
      },
      winner: null
    };

    this.server.emit(
      data.boardId,
      this.stateService.gameStart(game, players, data)
    );
  }

  @SubscribeMessage('gameStop')
  gameStop(client: Socket, data: { boardId: string }): void {
    this.server.emit(data.boardId, this.stateService.gameStop(data));
  }

  @SubscribeMessage('scoreClear')
  scoreClear(client: Socket, data: { boardId: string }): void {
    this.server.emit(data.boardId, this.stateService.scoreClear(data));
  }

  @SubscribeMessage('movesAccept')
  movesAccept(client: Socket, data: { boardId: string; value: number }): void {
    this.server.emit(data.boardId, this.stateService.movesAccept(data));
  }

  @SubscribeMessage('moveNext')
  moveNext(client: Socket, data: { boardId: string; col: number; row: number }): void {
    const { boardId, col, row } = data;
    const state = this.boards[boardId];

    const game = state.game.layers.game;
    const live = [...state.game.layers.live];
    let current = { ...state.game.current };

    live[col][row] = game[col][row];

    const teamId: number = current.team === Team.Red ? 0 : 1;

    const points = {
      reds: _.countBy(_.flatten(live), value => value === 0).true,
      blues: _.countBy(_.flatten(live), value => value === 1).true
    };

    let winner: Team = null;

    if (points.reds === (state.game.startTeam === Team.Red ? 9 : 8)) {
      winner = Team.Red;
    } else if (points.blues === (state.game.startTeam === Team.Blue ? 9 : 8)) {
      winner = Team.Blue;
    } else if (game[col][row] === 2) {
      winner = state.game.current.team === Team.Red ? Team.Blue : Team.Red;
    }
    /* If there was a black tile */
    if (winner) {
      current = {
        team: null,
        wordsNo: null
      };
      /* If there was an opponents' tile */
    } else if (game[col][row] !== teamId) {
      current = {
        team: teamId === 0 ? Team.Blue : Team.Red,
        wordsNo: null
      };
      /* If there was your tile and it is not the last move */
    } else if (game[col][row] === teamId && current.wordsNo > 1) {
      current.wordsNo--;
    } else if (game[col][row] === teamId && current.wordsNo === 1) {
      current = {
        team: teamId === 0 ? Team.Blue : Team.Red,
        wordsNo: null
      };
    }

    const result = {
      live,
      current,
      points,
      winner
    };

    this.server.emit(boardId, this.stateService.moveNext({ boardId, result }));
  }

  afterInit(server: Server) {
    this.logger.log('Socket server started');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    const { boardId, state } = this.stateService.handleDisconnect(client.id);

    if (state) {
      this.server.emit(boardId, state);
    }
  }
}
