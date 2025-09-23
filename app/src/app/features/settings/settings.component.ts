import { Component, inject, viewChild } from '@angular/core';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { GameService } from '../game/game.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  deleteAllGamesModal = viewChild.required<ModalComponent>(
    'deleteAllGamesModal',
  );

  router = inject(Router);
  authService = inject(AuthService);
  localStorageService = inject(LocalStorageService);
  gameService = inject(GameService);

  constructor() {}

  onDeleteAllGames() {
    this.authService.isUserAuth().subscribe({
      next: (isAuth) => {
        if (isAuth) {
          this.gameService.deleteAllGames().subscribe({
            next: () => this.deleteAllGamesModal().closeModal(),
            error: console.error,
          });
        } else {
          this.localStorageService.clear();
          this.deleteAllGamesModal().closeModal();
        }
      },
      error: console.error,
    });
  }
}
