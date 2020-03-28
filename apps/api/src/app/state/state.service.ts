import { Injectable } from '@nestjs/common';
import {
  AppState,
  BoardState,
  Game,
  Player,
  Team
} from '../../../../shared/model/state';
import { AppService } from '../app.service';

@Injectable()
export class StateService {
  public appState: AppState = {
    boards: {}
  };

  constructor(private appService: AppService) {
  }

  returnState(data: { boardId: string }): BoardState {
    const { boardId } = data;

    if (!this.appState.boards[boardId]) {
      this.appState.boards[boardId] = this.createInitialState();
    }

    return this.appState.boards[boardId];
  }

  playerUpdate(
    clientId: string,
    data: { boardId: string; player: Player }
  ): BoardState {
    const { boardId, player } = data;
    const state = this.appState.boards[boardId];

    if (!state.players[clientId]) {
      state.players[clientId] = { leadNo: 0 };
    }

    state.players[clientId] = {
      ...state.players[clientId],
      name: player.name,
      team: player.team
    };

    return state;
  }

  gameStart(game: Game, players: any, data: { boardId: string }): BoardState {
    const { boardId } = data;
    const state = this.appState.boards[boardId];

    const { reds, blues } = state.score;

    state.game = game;
    state.players = players;
    state.score = {
      ...state.score,
      reds: reds === 3 ? 0 : reds,
      blues: blues === 3 ? 0 : blues
    };

    return state;
  }

  gameStop(data: { boardId: string }): BoardState {
    const { boardId } = data;
    const state = this.appState.boards[boardId];

    state.game = null;

    return state;
  }

  scoreClear(data: { boardId: string }): BoardState {
    const { boardId } = data;
    const state = this.appState.boards[boardId];

    state.score = {
      reds: 0,
      blues: 0
    };

    return state;
  }

  movesAccept(data: { boardId: string; value: number }): BoardState {
    const { boardId, value } = data;
    const state = this.appState.boards[boardId];

    state.game = {
      ...state.game,
      current: {
        ...state.game.current,
        wordsNo: value
      }
    };

    return state;
  }

  moveNext(data: { boardId: string; result }): BoardState {
    const { boardId, result } = data;
    const state = this.appState.boards[boardId];

    const {
      live,
      current,
      points,
      winner
    } = result;

    state.game = {
      ...state.game,
      layers: {
        ...state.game.layers,
        live
      },
      current,
      winner,
      leaders: {
        ...state.game.leaders,
        red: {
          ...state.game.leaders.red,
          cardsLeft: (state.game.startTeam === Team.Red ? 9 : 8) - points.reds
        },
        blue: {
          ...state.game.leaders.blue,
          cardsLeft: (state.game.startTeam === Team.Blue ? 9 : 8) - points.blues
        }
      }
    };
    state.score = {
      ...state.score,
      reds: winner === Team.Red ? ++state.score.reds : state.score.reds,
      blues: winner === Team.Blue ? ++state.score.blues : state.score.blues
    };

    return state;
  }

  handleDisconnect(clientId: string): { boardId: string; state: BoardState } {
    let boardId: string;

    /* Find the board id the client */
    Object.keys(this.appState.boards).forEach(key => {
      if (this.appState.boards[key].players[clientId]) {
        delete this.appState.boards[key].players[clientId];
        boardId = key;
      }
    });

    const state = this.appState.boards[boardId];

    if (boardId) {
      const { game, players } = state;

      /* Pass the leadership to another team player */
      if (game) {
        if (game.leaders.red.id === boardId) {
          game.leaders.red.id = this.appService.getNextLeader(
            players,
            Team.Red
          );
        } else if (game.leaders.blue.id === boardId) {
          game.leaders.blue.id = this.appService.getNextLeader(
            players,
            Team.Blue
          );
        }
      }
    }

    /* Delete empty boards */
    Object.keys(this.appState.boards).forEach(key => {
      if (!Object.keys(this.appState.boards[key].players).length) {
        delete this.appState.boards[key];
      }
    });

    return { boardId, state };
  }

  getRandId(): { id: string } {
    let id;

    do {
      id = Math.random().toString(36).slice(2);
    } while (this.appState.boards[id]);

    return {id};
  }

  private createInitialState(): BoardState {
    return {
      players: {},
      game: null,
      score: {
        reds: 0,
        blues: 0
      }
    };
  }
}
