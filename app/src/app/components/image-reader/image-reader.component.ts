import {
  Component,
  EventEmitter,
  input,
  Input,
  model,
  output,
  Output,
} from '@angular/core';
import { Board, voidBoard } from '../../interfaces/board.interface';
import { ImgBoardComponent } from '../img-board/img-board.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-image-reader',
  standalone: true,
  imports: [ImgBoardComponent, NgClass],
  templateUrl: './image-reader.component.html',
  styleUrl: './image-reader.component.css',
})
export class ImageReaderComponent {
  tileType = input.required<'coloredTiles' | 'filledTiles'>();
  // onImageRead = output<Board>();

  board = model.required<Board>();

  isDrag: boolean = false;

  async onInputFiles(event: Event | DragEvent) {
    event.preventDefault();

    let file: File | null = null;

    if (event instanceof DragEvent) {
      file =
        event.dataTransfer?.items?.[0]?.getAsFile() ??
        event.dataTransfer?.files?.[0] ??
        null;
    } else {
      file = (event.target as HTMLInputElement)?.files?.[0] ?? null;
    }

    if (!file) {
      alert('No se seleccionó ningún archivo');
      return;
    }

    console.log('Archivo recibido:', file);

    // Procesar imagen
    const imgSrc = await this.#readAsDataURL(file);
    const img = await this.#loadImage(imgSrc);

    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) {
      alert('Error al procesar la imagen');
      return;
    }
    ctx.drawImage(img, 0, 0);
    const pixels = ctx.getImageData(0, 0, img.width, img.height).data;

    this.board().width = img.width;
    this.board().height = img.height;

    if (this.tileType() === 'filledTiles') {
      this.board().filledTiles = [];
    } else {
      this.board().coloredTiles = [];
    }

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      const hex = this.#rgbToHex(r, g, b);

      if (this.tileType() === 'filledTiles') {
        if (hex == '#000000') this.board().filledTiles.push(1);
        else this.board().filledTiles.push(0);
      } else {
        this.board().coloredTiles.push(hex);
      }
    }

    // this.onImageRead.emit(this.board);
  }

  #rgbToHex(r: number, g: number, b: number) {
    const twoDigits = (string: string) =>
      string.length === 1 ? '0' + string : string;

    return (
      '#' +
      twoDigits(r.toString(16)) +
      twoDigits(g.toString(16)) +
      twoDigits(b.toString(16))
    );
  }

  #readAsDataURL(file: File) {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (ev) => {
        if (ev.target == null) {
          reject();
          return;
        }
        const result = ev.target.result;
        resolve(result || '');
      });
      reader.readAsDataURL(file);
    });
  }

  #loadImage(src: string | ArrayBuffer) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src.toString();
    });
  }

  dragEnter() {
    this.isDrag = true;
  }
  dragLeave() {
    this.isDrag = false;
  }
}
