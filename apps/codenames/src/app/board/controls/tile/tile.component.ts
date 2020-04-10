import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'cdn-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent implements OnInit {
  @Input() value: number;
  @Input() accepted: {
    value: number;
    max: number;
  };

  deg: number;

  ngOnInit(): void {
    this.deg = _.random(-3, 3, true);
  }
}
