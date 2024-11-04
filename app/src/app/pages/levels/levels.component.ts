import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent {
  levels: any = [{
    level: 1,
    complete: true,
  },{
    level: 2,
    complete: false,
  },{
    level: 3,
    complete: false,
  }, {
    level:4,
    complete: false,
  }, {
    level:5,
    complete: false,
  },
  ]
}
