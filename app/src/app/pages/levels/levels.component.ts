import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Level } from '../../interfaces/level.interface';
import { LevelService } from '../../services/level.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent {
  levels: Level[] = []

  levelService = inject(LevelService)

  ngOnInit() {
    this.levelService.getLevels().subscribe((res) => {
      if (res.ok) {
        this.levels = res.datos

      }

    })
  }
}
