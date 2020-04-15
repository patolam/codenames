import { Injectable } from '@nestjs/common';
import { AppState, BoardState, Dict, Game, Player, Team } from '../../../../shared/model/state';
import { AppService } from '../app.service';
import { default_pl } from '../../assets/dictionaries/default/pl';
import { ambiguous_pl } from '../../assets/dictionaries/ambiguous/pl';
import * as _ from 'lodash';

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
      this.appState.boards[boardId] = this.createInitialState(boardId);
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
      state.players[clientId] = {
        leadNo: 0,
        requests: {}
      };

      state.chat.push({
        text: 'chat.server.playerJoined',
        params: { value: player.name }
      });
    }

    state.players[clientId] = {
      ...state.players[clientId],
      name: player.name,
      team: player.team
    };

    return state;
  }

  updateRequest(clientId: string, data: { boardId: string; request: string }): BoardState {
    const { boardId, request } = data;
    const state = this.appState.boards[boardId];

    const requests = { ...state.players[clientId].requests };
    requests[request] = true;

    state.players[clientId] = {
      ...state.players[clientId],
      requests
    };

    return state;
  }

  gameStart(game: Game, players: any, data: { boardId: string }): BoardState {
    const { boardId } = data;
    const state = this.appState.boards[boardId];

    const { reds, blues } = state.score;

    const players1 = { ...players };
    Object.values(players1).forEach((player: Player) => player.requests = {});

    state.game = game;
    state.players = players1;
    state.score = {
      ...state.score,
      reds: reds === 3 ? 0 : reds,
      blues: blues === 3 ? 0 : blues
    };
    state.chat = [];

    if (state.dictionary.length >= 25) {
      state.dictionary.splice(0, 25);
    }

    state.chat.push({
      text: 'chat.server.gameStart',
    });

    return state;
  }

  gameStop(data: { boardId: string }): BoardState {
    const { boardId } = data;
    const state = this.appState.boards[boardId];

    const players = { ...state.players };
    Object.values(players).forEach((player: Player) => player.requests = {});

    state.players = players;
    state.game = null;

    state.chat.push({
      text: 'chat.server.gameStop',
    });

    return state;
  }

  scoreClear(data: { boardId: string }): BoardState {
    const { boardId } = data;
    const state = this.appState.boards[boardId];

    const players = { ...state.players };
    Object.values(players).forEach((player: Player) => player.requests = {});

    state.players = players;
    state.score = {
      reds: 0,
      blues: 0
    };

    state.chat.push({
      text: 'chat.server.scoreClear',
    });

    return state;
  }

  movesAccept(data: {
    boardId: string;
    move: { wordsNo: number; word: string }
  }): BoardState {
    const { boardId, move } = data;
    const state = this.appState.boards[boardId];

    state.game = {
      ...state.game,
      current: {
        ...state.game.current,
        wordsNo: move?.wordsNo,
        word: move?.word
      }
    };

    return state;
  }

  textSend(clientId: string, data: {
    boardId: string;
    text: string
  }): BoardState {
    const { boardId, text } = data;
    const state = this.appState.boards[boardId];

    const chat = [...state.chat];
    chat.push({
      name: state.players[clientId].name,
      team: state.players[clientId].team,
      text
    });

    state.chat = chat;

    return state;
  }

  acceptSwitch(data: { boardId: string; accept: Dict<[number, number]> }): BoardState {
    const { boardId, accept } = data;
    const state = this.appState.boards[boardId];

    state.game = {
      ...state.game,
      accept
    };

    return state;
  }

  moveNext(data: { boardId: string; result }): BoardState {
    const { boardId, result } = data;
    const state = this.appState.boards[boardId];

    const {
      live,
      current,
      players,
      points,
      winner,
      accept
    } = result;

    state.game = {
      ...state.game,
      accept,
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

    state.players = players;

    if (winner) {
      state.chat.push({
        text: 'chat.server.gameEnd'
      });

      if (state.dictionary.length < 25) {
        state.dictionary = this.getDictionary(boardId);
      }
    }

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

      /* Delete leader entry */
      if (this.appState.boards[key].game?.leaders?.red?.id === clientId) {
        this.appState.boards[key].game.leaders.red = null;
      } else if (this.appState.boards[key].game?.leaders?.blue?.id === clientId) {
        this.appState.boards[key].game.leaders.blue = null;
      }
    });

    let state = this.appState.boards[boardId];

    if (boardId) {
      const { game } = state;

      /* Stop the game if there is no leader left for the team */
      if (game && !(game.leaders.red && game.leaders.blue)) {
        state = this.gameStop({ boardId });
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

    return { id };
  }

  private createInitialState(boardId: string): BoardState {
    return {
      players: {},
      game: null,
      score: {
        reds: 0,
        blues: 0
      },
      chat: [],
      dictionary: this.getDictionary(boardId),
    };
  }

  private getDictionary(boardId: string) {
    return _.shuffle(boardId === 'ambiguous' ? ambiguous_pl : default_pl);
  }
}
