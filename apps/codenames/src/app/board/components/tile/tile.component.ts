import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cdn-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() value: number;

  constructor() { }

  ngOnInit(): void {
  }

}
