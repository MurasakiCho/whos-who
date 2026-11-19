// Routing Configuration

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { EndgameComponent } from './pages/endgame/endgame.component';
import { GameplayComponent } from './pages/gameplay/gameplay.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { ConfigComponent } from './pages/config/config.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: "home", component: HomeComponent },
  { path: 'endgame', component: EndgameComponent },
  { path: 'gameplay', component: GameplayComponent },
  { path: "leaderboard", component: LeaderboardComponent },
  { path: "settings", component: ConfigComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
