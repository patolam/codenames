import { Injectable } from '@nestjs/common';
import { Player, Team } from '../../../shared/model/state';
import * as _ from 'lodash';
import { dictionary } from '../assets/dictionary';

@Injectable()
export class AppService {
  getLiveBoard(): number[][] {
    const board: number[] = [-2, -2, -2, -2, -2];
    const result: number[][] = [];

    for (let i = 0; i < 5; i++) {
      result.push([...board]);
    }

    return result;
  }

  getWordsBoard(): string[][] {
    return this.arrayToBoard(_.shuffle(dictionary).slice(0, 25));
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

  getNextLeader(players: Player[], team: Team): Player {
    const teamPlayers = players.filter((item: Player) => item.team === team);
    const minLead = _.minBy(teamPlayers, 'leadNo').leadNo;

    return _.sample(
      teamPlayers.filter((item: Player) => item.leadNo === minLead)
    );
  }

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
