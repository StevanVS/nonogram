import { Routes } from '@angular/router';
import { GameComponent } from './pages/game/game.component';
import { EditLevelsComponent } from './pages/edit-levels/edit-levels.component';

export const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'edit-levels', component: EditLevelsComponent },
];
