import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-img-board',
  standalone: true,
  imports: [],
  templateUrl: './img-board.component.html',
  styleUrl: './img-board.component.css'
})
export class ImgBoardComponent {
  @Input({ required: true }) width: number = 0;
  @Input({ required: true }) height: number = 0;
  @Input({ required: true }) tiles: string[] | number[] = [];

  getImageSrc(): string {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    this.tiles.forEach((value, index) => {
      const x = index % this.width;
      const y = Math.floor(index / this.width);
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
