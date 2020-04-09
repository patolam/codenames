export enum Team {
  Red = 'Red',
  Blue = 'Blue',
}

export interface Dict<T> {
  [key: string]: T,
}

export interface Player {
  name?: string;
  team?: Team;
  leadNo?: number;
  requests: {
    start?: boolean;
    stop?: boolean;
    clear?: boolean;
  }
}

export interface Game {
  startTeam: Team;
  leaders: {
    red: {
      id: string;
      cardsLeft: number;
    },
    blue: {
      id: string;
      cardsLeft: number;
    }
  }
  current: {
    team: Team;
    wordsNo?: number;
    word: string;
  };
  layers: {
    words: string[][];
    game: number[][];
    live: number[][];
  };
  accept: Dict<[number, number]>;
  winner: Team;
}

export interface BoardState {
  players: Dict<Player>;
  game: Game;
  score: {
    reds: number;
    blues: number;
  },
  event?: {
    startGame?: boolean;
    endGame?: boolean;
    textSend?: boolean;
  }
  chat: {
    name?: string;
    team?: Team;
    text: string;
    params?: any;
  }[],
  dictionary: string[],
}

export interface AppState {
  boards: Dict<BoardState>;
}
