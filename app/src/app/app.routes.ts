import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LevelsComponent } from './pages/levels/levels.component';
import { GameComponent } from './pages/game/game.component';
import { EditLevelsComponent } from './pages/edit-levels/edit-levels.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'levels', component: LevelsComponent },
  { path: 'game', component: GameComponent },
  { path: 'edit-levels', component: EditLevelsComponent },

  { path: '**', component: HomeComponent },
];
