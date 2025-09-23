import { Component, inject } from '@angular/core';
import { Level } from './level.model';
import { RouterLink } from '@angular/router';
import { LevelService } from './level.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { AuthService } from '../../core/auth/auth.service';
import { ImgBoardComponent } from '../../shared/components/img-board/img-board.component';
import { Game } from '../game/models/game.model';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [RouterLink, ImgBoardComponent, ImgBoardComponent],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css',
})
export class LevelsComponent {
  levelList: Level[] = [];

  levelService = inject(LevelService);
  localStorageService = inject(LocalStorageService);
  authService = inject(AuthService);

  ngOnInit() {
    this.authService.isUserAuth().subscribe({
      next: (isAuth) => {
        let games: Game[] = [];
        if (!isAuth) {
          games = this.localStorageService.getItem<Game[]>('games') || [];
        }
        this.getLevels(games);
      },
      error: console.error,
    });
  }

  getLevels(games: Game[]) {
    this.levelService.getLevels(games).subscribe({
      next: (res) => {
        if (res.ok) {
          // console.log('levels', res.datos);
          this.levelList = res.datos;
        }
      },
      error: console.error,
    });
  }
}
