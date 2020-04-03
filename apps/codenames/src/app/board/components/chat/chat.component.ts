import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';

@Component({
  selector: 'cdn-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnChanges {
  @ViewChild('chat', { static: false }) chat: ElementRef;

  @Input() state: BoardState;

  @Output() sendText: EventEmitter<string> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state.currentValue) {
      this.scrollToEnd();
    }
  }

  textSend(input: HTMLInputElement): void {
    if (input.value) {
      this.sendText.emit(input.value);
      input.value = '';
    }
  }

  scrollToEnd(): void {
    setTimeout(() => this.chat.nativeElement.scrollTo({ top: this.chat.nativeElement.scrollHeight }), 0);
  }
}
