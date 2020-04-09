import { Pipe, PipeTransform } from '@angular/core';
import { Dict, Player } from '../model/state';
import * as _ from 'lodash';

@Pipe({ name: 'team' })
export class TeamPipe implements PipeTransform {
  transform(players: Dict<Player>, team: string): Dict<Player> {
    return _.pickBy(players, (player: Player) => player.team === team);
  }
}
