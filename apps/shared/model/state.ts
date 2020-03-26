export enum Team {
  Red = 'Red',
  Blue = 'Blue',
}

export interface Player {
  name?: string;
  team?: Team;
  leadNo?: number;
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
  };
  layers: {
    live: any;
    words: string[][];
    game: number[][];
  };
  winner: Team;
}

export interface BoardState {
  players: {
    [key: string]: Player,
  };
  game: Game;
  score: {
    reds: number;
    blues: number;
  }
}

export interface AppState {
  boards: {
    [key: string]: BoardState,
  };
}
