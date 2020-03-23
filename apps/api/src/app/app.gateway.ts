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
import { AppState, Game, Player, Team } from '../../../shared/model/state';
import * as _ from 'lodash';
import { AppService } from './app.service';

const initialState: AppState = {
  players: [],
  game: null,
  score: {
    reds: 0,
    blues: 0
  }
};

@WebSocketGateway(90)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  state: AppState;

  private logger: Logger = new Logger('AppGateway');

  constructor(
    private appService: AppService
  ) {
    this.state = initialState;
  }

  @SubscribeMessage('player')
  handlePlayer(client: Socket, player: Partial<Player>): void {
    const idx = this.getIdx(client.id);

    if (idx > -1) {
      this.state.players[idx] = {
        ...this.state.players[idx],
        name: player.name,
        team: player.team,
        leadNo: 0
      };
    }

    this.server.emit('state', this.state);
  }

  @SubscribeMessage('startGame')
  handleStartGame(client: Socket): void {
    const nextTeam: Team = _.sample(Team);
    const leadRed: Player = this.appService.getNextLeader(this.state.players, Team.Red);
    const leadBlue: Player = this.appService.getNextLeader(this.state.players, Team.Blue);

    const players: Player[] = [...this.state.players];
    const redIdx = players.findIndex((item: Player) => item.name === leadRed.name);
    const blueIdx = players.findIndex((item: Player) => item.name === leadBlue.name);

    players[redIdx].leadNo++;
    players[blueIdx].leadNo++;

    const game: Game = {
      startTeam: nextTeam,
      redName: leadRed.name,
      blueName: leadBlue.name,
      redLeft: nextTeam === Team.Red ? 9 : 8,
      blueLeft: nextTeam === Team.Blue ? 9 : 8,
      current: {
        team: nextTeam,
        wordsNo: null
      },
      boards: {
        live: this.appService.getLiveBoard(),
        words: this.appService.getWordsBoard(),
        game: this.appService.getGameBoard(nextTeam)
      },
      winner: null,
    };

    this.state = {
      ...this.state,
      game,
      players
    };

    this.server.emit('state', this.state);
  }

  @SubscribeMessage('stopGame')
  handleStopGame(client: Socket): void {
    this.state = {
      ...this.state,
      game: null
    };

    this.server.emit('state', this.state);
  }

  @SubscribeMessage('clearScore')
  clearScore(client: Socket): void {
    this.state = {
      ...this.state,
      score: {
        reds: 0,
        blues: 0
      }
    };

    this.server.emit('state', this.state);
  }

  @SubscribeMessage('acceptMoves')
  handleAcceptMoves(client: Socket, value: number): void {
    this.state = {
      ...this.state,
      game: {
        ...this.state.game,
        current: {
          ...this.state.game.current,
          wordsNo: value
        }
      }
    };

    this.server.emit('state', this.state);
  }

  @SubscribeMessage('nextMove')
  handleNextMove(client: Socket, values: { col: number, row: number }): void {
    const { col, row } = values;

    const game = this.state.game.boards.game;
    const live = [...this.state.game.boards.live];
    let current = { ...this.state.game.current };

    live[col][row] = game[col][row];

    const teamId: number = current.team === Team.Red ? 0 : 1;

    const redCount = _.countBy(_.flatten(live), (value => value === 0)).true;
    const blueCount = _.countBy(_.flatten(live), (value => value === 1)).true;

    let winner: Team = null;

    if (redCount === (this.state.game.startTeam === Team.Red ? 9 : 8)) {
      winner = Team.Red;
    } else if (blueCount === (this.state.game.startTeam === Team.Blue ? 9 : 8)) {
      winner = Team.Blue;
    } else if (game[col][row] === 2) {
      winner = this.state.game.current.team === Team.Red ? Team.Blue : Team.Red;
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

    this.state = {
      ...this.state,
      game: {
        ...this.state.game,
        boards: {
          ...this.state.game.boards,
          live
        },
        current,
        winner,
        redLeft: (this.state.game.startTeam === Team.Red ? 9 : 8) - redCount,
        blueLeft: (this.state.game.startTeam === Team.Blue ? 9 : 8) - blueCount,
      },
      score: {
        ...this.state.score,
        reds: winner === Team.Red ? ++this.state.score.reds : this.state.score.reds,
        blues: winner === Team.Blue ? ++this.state.score.blues : this.state.score.blues,
      }
    };

    this.server.emit('state', this.state);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    this.state.players.push({ id: client.id, leadNo: 0 });
    this.server.emit('state', this.state);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    this.state.players.splice(this.getIdx(client.id), 1);
    this.server.emit('state', this.state);
  }

  private getIdx = (id: string): number => this.state.players.findIndex((item: Player) => item.id === id);
}
