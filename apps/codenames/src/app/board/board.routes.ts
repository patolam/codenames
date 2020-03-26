import { Routes } from '@angular/router';
import { BoardComponent } from './containers/board/board.component';

export const routes: Routes = [
  {
    path: 'board',
    children: [
      {
        path: ':id',
        component: BoardComponent,
      },
    ]
  }
];
