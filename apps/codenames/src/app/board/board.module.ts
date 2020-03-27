import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './containers/board/board.component';
import { TileComponent } from './components/tile/tile.component';
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
import { DialogComponent } from './components/dialog/dialog.component';
import { DialogMovesComponent } from './components/dialog-moves/dialog-moves.component';
import { DialogPlayerComponent } from './components/dialog-player/dialog-player.component';
import { DialogEndGameComponent } from './components/dialog-end-game/dialog-end-game.component';

const config: SocketIoConfig = { url: environment.socket, options: {} };

@NgModule({
  declarations: [BoardComponent, TileComponent, TeamPipe, HeaderComponent, DialogPlayerComponent, TeamsComponent, LayerGameComponent, LayerLiveComponent, DialogComponent, DialogMovesComponent, DialogEndGameComponent],
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
    MatDialogModule
  ],
  providers: []
})
export class BoardModule {
}

