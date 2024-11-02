import { Component, Input } from '@angular/core';
import { Board, voidBoard } from '../../interfaces/board.interface';

@Component({
  selector: 'app-board-details',
  standalone: true,
  imports: [],
  templateUrl: './board-details.component.html',
  styleUrl: './board-details.component.css',
})
export class BoardDetailsComponent {
  @Input({ required: true }) board: Board = voidBoard();

  ngOnInit() {
    console.log('init', this.board);
  }

  getImageSrc(tiles: string[] | number[]): string {
    const canvas = document.createElement('canvas');
    canvas.width = this.board.width;
    canvas.height = this.board.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    tiles.forEach((value, index) => {
      const x = index % this.board.width;
      const y = Math.floor(index / this.board.width);
      if (typeof value === 'number') {
        ctx.fillStyle = value === 1 ? '#000' : '#fff';
      } else {
        ctx.fillStyle = value;
      }
      ctx.fillRect(x, y, 1, 1);
    });

    const dataURL = canvas.toDataURL("image/png");
    
    return dataURL;
  }
}
