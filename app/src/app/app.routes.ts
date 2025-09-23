import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { GameComponent } from './features/game/game.component';
import { SettingsComponent } from './features/settings/settings.component';
import { BoardEditorComponent } from './features/board-editor/board-editor.component';
import { ProfileComponent } from './features/profile/profile.component';
import { isAdmin, isAuth, isNotAuth } from './core/auth/auth.guard';
import { LevelsComponent } from './features/levels/levels.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'levels', component: LevelsComponent },
  { path: 'game/:id', component: GameComponent },
  {
    path: 'board-editor',
    canActivate: [isAdmin],
    component: BoardEditorComponent,
  },
  { path: 'settings', component: SettingsComponent },
  { path: 'profile', canActivate: [isAuth], component: ProfileComponent },
  {
    path: 'auth',
    canActivate: [isNotAuth],
    loadChildren: () => import('./core/auth/auth.routes').then((m) => m.routes),
  },
  { path: '**', redirectTo: '' },
];
