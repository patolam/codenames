import { Component, Input } from '@angular/core';

@Component({
  selector: 'cdn-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() width: string;
  @Input() height: string;
}
