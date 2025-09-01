import { Component, inject } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  router = inject(Router);
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  gameService = inject(GameService);

  constructor() {}

  onDeleteAllGames() {
    this.authService.isUserAuthenticated().subscribe({
      next: (isAuth) => {
        if (isAuth) {
          this.gameService.deleteAllGames().subscribe({
            error: console.error,
          });
        } else {
          this.localStorageService.clear();
        }
      },
      error: console.error,
    });
  }
}
