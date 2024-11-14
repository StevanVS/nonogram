import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Level } from '../../interfaces/level.interface';
import { LevelService } from '../../services/level.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ImgBoardComponent } from '../../components/img-board/img-board.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { getImageSrc } from '../../utils/getImageSrc';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [NavbarComponent, ImgBoardComponent, RouterLink],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent {
  levels: Level[] = []

  levelService = inject(LevelService)
  localStorageService = inject(LocalStorageService)

  ngOnInit() {
    const completedLevels = this.localStorageService
      .getItem<string[]>('completedLevels')

    this.levelService.getLevels(completedLevels || []).subscribe((res) => {
      if (res.ok) {
        this.levels = res.datos
      }
    })
  }

  getImageSrc(tiles: string[], width: number, height: number) {
    return getImageSrc(tiles, width, height)
  }
}
