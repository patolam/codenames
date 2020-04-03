export enum Team {
  Red = 'Red',
  Blue = 'Blue',
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
  accept: {
    [clientId: string]: [number, number]
  };
  winner: Team;
}

export interface BoardState {
  players: {
    [clientId: string]: Player,
  };
  game: Game;
  score: {
    reds: number;
    blues: number;
  },
  event?: {
    endGame?: boolean;
    textSend?: boolean;
  }
  chat: {
    name: string;
    team: Team;
    text: string
  }[]
}

export interface AppState {
  boards: {
    [key: string]: BoardState,
  };
}
