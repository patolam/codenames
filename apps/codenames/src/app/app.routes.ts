import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'board',
        loadChildren: () =>
          import('./board/board.module').then(m => m.BoardModule)
      }
    ]
  }
];
