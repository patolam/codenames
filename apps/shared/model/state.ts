export enum Team {
  Red = 'Red',
  Blue = 'Blue',
}

export interface Player {
  id: string;
  name?: string;
  team?: Team;
  leadNo?: number;
}

export interface Game {
  startTeam: Team;
  redName: string;
  blueName: string;
  redLeft: number;
  blueLeft: number;
  current: {
    team: Team;
    wordsNo?: number;
  };
  boards: {
    live: any;
    words: string[][];
    game: number[][];
  };
  winner: Team;
}

export interface AppState {
  players: Player[];
  game: Game;
  score: {
    reds: number;
    blues: number;
  }
}
