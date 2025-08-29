import { Component, inject } from '@angular/core';
import { Level } from '../../interfaces/level.interface';
import { RouterLink } from '@angular/router';
import { ImgBoardComponent } from '../../components/img-board/img-board.component';
import { LevelService } from '../../services/level.service';
import { LocalStorageService } from '../../services/local-storage.service';

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

  ngOnInit() {
    const completedLevels =
      this.localStorageService.getItem<string[]>('completedLevels');
    const games = this.localStorageService.getItem<any[]>('games');

    this.levelService.getLevels(completedLevels || []).subscribe((res) => {
      if (res.ok) {
        // console.log(res.datos)
        this.levelList = res.datos;
        games?.forEach((g) => {
          const level = this.levelList.find((l) => l.order === g.level);
          if (level == null) return;
          level.progressPorcentage = g.progressPorcentage;
        });
      }
    });
  }
}
