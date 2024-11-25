import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  standalone: true,
  imports: [],
  templateUrl: './circular-progress.component.html',
  styleUrl: './circular-progress.component.css',
})
export class CircularProgressComponent {
  @Input() progress: number | null = null;
}
