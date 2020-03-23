import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BoardModule } from './board/board.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { BoardComponent } from './board/containers/board/board.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BoardModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([{ path: '', component: BoardComponent }], { useHash: true }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
