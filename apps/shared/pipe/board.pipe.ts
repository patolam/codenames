import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../model/state';
import * as _ from 'lodash';

@Pipe({ name: 'team' })
export class TeamPipe implements PipeTransform {
  transform(players: {[key: string]: Player}, team: string): {[key: string]: Player} {
    return _.pickBy(players, (player: Player) => player.team === team);
  }
}
