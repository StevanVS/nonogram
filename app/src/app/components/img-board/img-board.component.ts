import { Component, input, Input } from '@angular/core';
import { ImgBoard } from '../../interfaces/img-board';

@Component({
  selector: 'app-img-board',
  standalone: true,
  imports: [],
  templateUrl: './img-board.component.html',
  styleUrl: './img-board.component.css',
})
export class ImgBoardComponent {
  imgBoard = input.required<ImgBoard>();

  getImageSrc(): string {
    const canvas = document.createElement('canvas');
    canvas.width = this.imgBoard().width;
    canvas.height = this.imgBoard().height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    this.imgBoard().tiles.forEach((value, index) => {
      const x = index % this.imgBoard().width;
      const y = Math.floor(index / this.imgBoard().width);
      if (typeof value === 'number') {
        ctx.fillStyle = value === 1 ? '#000' : '#fff';
      } else {
        ctx.fillStyle = value;
      }
      ctx.fillRect(x, y, 1, 1);
    });

    const dataURL = canvas.toDataURL('image/png');

    return dataURL;
  }
}
