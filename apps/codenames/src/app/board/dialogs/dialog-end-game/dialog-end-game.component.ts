import { Component, Inject, OnInit } from '@angular/core';
import { BoardState } from '../../../../../../shared/model/state';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cdn-dialog-end-game',
  templateUrl: './dialog-end-game.component.html',
  styleUrls: ['./dialog-end-game.component.scss']
})
export class DialogEndGameComponent implements OnInit {
  state: BoardState;

  constructor(
    public dialogRef: MatDialogRef<DialogEndGameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService
  ) {
    this.state = data.state;
  }

  ngOnInit(): void {
  }

  getWinnerTranslate(): any {
    return {
      value: this.translate.instant(`common.team.${this.state?.game?.winner}`)
    };
  }

  shareClick(): void {
    this.showPopup(`https://www.facebook.com/sharer/sharer.php?
      u=http://playkeywords.pl
      &quote=Keywords - zespołowa gra słowna online
      &picture=${environment.api}/screen`,
      300, 600);
  }

  private showPopup(url: string, width: number, height: number): void {
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    window.open(url, 'popup', `width=${width}, height=${width}, top=${top}, left=${left}`);
  }
}
