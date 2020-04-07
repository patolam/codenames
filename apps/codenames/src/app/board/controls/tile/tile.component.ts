import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cdn-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() value: number;
  @Input() accepted: {
    value: number;
    max: number;
  };

  constructor() { }

  ngOnInit(): void {
  }

}
