import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../../../../../shared/model/state';

@Pipe({ name: 'team' })
export class TeamPipe implements PipeTransform {
  transform(players: Player[], team: string): Player[] {
    return (players || []).filter((item: Player) => item.team === team);
  }
}
