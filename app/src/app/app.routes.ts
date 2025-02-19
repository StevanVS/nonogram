import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LevelsComponent } from './pages/levels/levels.component';
import { GameComponent } from './pages/game/game.component';
import { EditLevelsComponent } from './pages/edit-levels/edit-levels.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'levels', component: LevelsComponent },
  { path: 'game/:level', component: GameComponent },
  { path: 'edit-levels', component: EditLevelsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: '' },
];
