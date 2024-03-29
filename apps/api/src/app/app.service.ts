import { Injectable } from '@nestjs/common';
import { Dict, Player, Team } from '../../../shared/model/state';
import * as _ from 'lodash';

@Injectable()
export class AppService {
  getLiveBoard(): number[][] {
    return this.simpleBoardFactory(-2);
  }

  getWordsBoard(dictionary: string[]): string[][] {
    return this.arrayToBoard(dictionary).slice(0, 5);
  }

  getGameBoard(leadTeam: Team): number[][] {
    const board: number[] = [];

    for (let i = 0; i < 9; i++) {
      board.push(leadTeam === Team.Red ? 0 : 1);
    }
    for (let i = 0; i < 8; i++) {
      board.push(leadTeam === Team.Red ? 1 : 0);
    }
    for (let i = 0; i < 7; i++) {
      board.push(-1);
    }
    board.push(2);

    return this.arrayToBoard(_.shuffle(board));
  }

  getNextLeader(players: Dict<Player>, team: Team): string {
    const teamEntries: [string, Player][] = Object.entries(players).filter((item: [string, Player]) => item[1].team === team);
    const minLeads: number = _.minBy(teamEntries, (item: [string, Player]) => item[1].leadNo)[1].leadNo;

    return _.sample(teamEntries
      .filter((item: [string, Player]) => item[1].leadNo === minLeads)
      .map(item => item[0])
    );
  }

  private simpleBoardFactory = (value: any) => {
    const board: any[] = [];

    for (let i = 0; i < 5; i++) {
      board.push(value);
    }

    const result: any[][] = [];

    for (let i = 0; i < 5; i++) {
      result.push([...board]);
    }

    return result;
  };

  private arrayToBoard(array: any[]): any[][] {
    const result: number[][] = [];

    array.forEach((item: number, idx: number) => {
      if (idx % 5 === 0) {
        result.push([]);
      }
      result[result.length - 1].push(item);
    });

    return result;
  }
}
