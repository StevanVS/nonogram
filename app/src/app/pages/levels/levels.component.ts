import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Level } from '../../interfaces/level.interface';
import { LevelService } from '../../services/level.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { getImageSrc } from '../../utils/getImageSrc';
import { CircularProgressComponent } from '../../components/circular-progress/circular-progress.component';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CircularProgressComponent],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css',
})
export class LevelsComponent {
  levels: Level[] = [];

  levelService = inject(LevelService);
  localStorageService = inject(LocalStorageService);

  ngOnInit() {
    const completedLevels =
      this.localStorageService.getItem<string[]>('completedLevels');
    const games = this.localStorageService.getItem<any[]>('games');

    this.levelService.getLevels(completedLevels || []).subscribe((res) => {
      if (res.ok) {
        this.levels = res.datos;
        games?.forEach((g) => {
          const level = this.levels.find((l) => l.level === g.level);
          if (level == null) return;
          level.progressPorcentage = g.progressPorcentage;
        });
      }
    });
  }

  getImageSrc(tiles: string[], width: number, height: number) {
    return getImageSrc(tiles, width, height);
  }
}
