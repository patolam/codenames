import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './containers/board/board.component';
import { MatInputModule } from '@angular/material/input';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../../environments/environment';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamPipe } from '../../../../shared/pipe/board.pipe';
import { RouterModule } from '@angular/router';
import { routes } from './board.routes';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { TeamsComponent } from './components/teams/teams.component';
import { LayerGameComponent } from './components/layer-game/layer-game.component';
import { LayerLiveComponent } from './components/layer-live/layer-live.component';
import { ChatComponent } from './components/chat/chat.component';
import { TranslateModule } from '@ngx-translate/core';
import { CaptionComponent } from './controls/caption/caption.component';
import { TileComponent } from './controls/tile/tile.component';
import { DialogPlayerComponent } from './dialogs/dialog-player/dialog-player.component';
import { DialogMovesComponent } from './dialogs/dialog-moves/dialog-moves.component';
import { DialogEndGameComponent } from './dialogs/dialog-end-game/dialog-end-game.component';
import { ButtonComponent } from './controls/button/button.component';
import { DialogComponent } from './controls/dialog/dialog.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { StatusComponent } from './components/status/status.component';

const config: SocketIoConfig = { url: environment.socket, options: {} };

@NgModule({
  declarations: [
    BoardComponent,
    TileComponent,
    TeamPipe,
    HeaderComponent,
    DialogPlayerComponent,
    TeamsComponent,
    LayerGameComponent,
    LayerLiveComponent,
    DialogComponent,
    DialogMovesComponent,
    DialogEndGameComponent,
    ChatComponent,
    ButtonComponent,
    CaptionComponent,
    ToolbarComponent,
    StatusComponent
  ],
  exports: [BoardComponent],
  imports: [
    CommonModule,
    MatInputModule,
    SocketIoModule.forRoot(config),
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatRippleModule,
    MatDialogModule,
    TranslateModule.forChild()
  ],
  providers: []
})
export class BoardModule {}
