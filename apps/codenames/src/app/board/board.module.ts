import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './containers/board/board.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { TileComponent } from './components/tile/tile.component';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../../environments/environment';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamPipe } from '../../../../shared/pipe/board.pipe';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { routes } from './board.routes';

const config: SocketIoConfig = { url: environment.socket, options: {} };

@NgModule({
  declarations: [BoardComponent, TileComponent, TeamPipe],
  exports: [BoardComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    SocketIoModule.forRoot(config),
    MatSelectModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatChipsModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    MatSnackBar,
  ]
})
export class BoardModule {}
