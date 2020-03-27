import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cdn-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() header: string;

  constructor() { }

  ngOnInit(): void {
  }

}
