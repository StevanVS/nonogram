import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LevelsComponent } from './pages/levels/levels.component';
import { GameComponent } from './pages/game/game.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BoardEditorComponent } from './pages/board-editor/board-editor.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { isAdmin, isAuth, isNotAuth } from './guard/auth.guard';

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
  { path: 'login', canActivate: [isNotAuth], component: LoginComponent },
  { path: 'register', canActivate: [isNotAuth], component: RegisterComponent },
  { path: '**', redirectTo: '' },
];
