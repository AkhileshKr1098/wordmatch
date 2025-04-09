import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WordMatchComponent } from './word-match/word-match.component';

const routes: Routes = [
  {path:'',component:WordMatchComponent},
  {path:'wordmatch',component:WordMatchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
