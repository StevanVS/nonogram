import { Component, Input } from '@angular/core';
import { Board } from '../../interfaces/board.interface';

@Component({
  selector: 'app-board-details',
  standalone: true,
  imports: [],
  templateUrl: './board-details.component.html',
  styleUrl: './board-details.component.css'
})
export class BoardDetailsComponent {
  @Input({required: true}) board!: Board;
}
