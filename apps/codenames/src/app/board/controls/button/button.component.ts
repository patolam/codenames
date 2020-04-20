import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cdn-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() width: string;
  @Input() height: string;

  @Output() press: EventEmitter<any> = new EventEmitter();
}
