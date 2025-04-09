import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WordMatchComponent } from './word-match/word-match.component';
import { WordMatch2Component } from './word-match-2/word-match-2.component';

@NgModule({
  declarations: [
    AppComponent,
    WordMatchComponent,
    WordMatch2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
