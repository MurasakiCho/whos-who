// Routing Imports

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ConfigComponent } from "./pages/config/config.component";
import { EndgameComponent } from './pages/endgame/endgame.component';
import { HomeComponent } from "./pages/home/home.component";
import { GameplayComponent } from './pages/gameplay/gameplay.component';
import { LeaderboardComponent } from "./pages/leaderboard/leaderboard.component";
import { LeadersComponent } from "./components/leaders/leaders.component";
import { NavigationComponent } from './components/navigation/navigation.component';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CallbackComponent } from './components/callback/callback.component';



@NgModule({
  declarations: [AppComponent, HomeComponent, NavigationComponent, EndgameComponent, GameplayComponent, LeadersComponent, LeaderboardComponent, ConfigComponent, CallbackComponent],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
