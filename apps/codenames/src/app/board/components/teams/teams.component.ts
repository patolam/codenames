import { Component, Input, OnInit } from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';

@Component({
  selector: 'cdn-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  @Input() state: BoardState;

  constructor() { }

  ngOnInit(): void {
  }

}
