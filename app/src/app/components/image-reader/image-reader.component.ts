import { Component, EventEmitter, Output, output } from '@angular/core';
import { Board, voidBoard } from '../../interfaces/board.interface';

@Component({
  selector: 'app-image-reader',
  standalone: true,
  imports: [],
  templateUrl: './image-reader.component.html',
  styleUrl: './image-reader.component.css',
})
export class ImageReaderComponent {
  @Output() onImageRead: EventEmitter<Board> = new EventEmitter();

  board: Board = voidBoard();

  async onInputFiles(event: Event | DragEvent) {
    event.preventDefault();

    let files: File[];
    if (event instanceof DragEvent && event.dataTransfer?.items) {
      files =
        Array.from(event.dataTransfer.items)
          .map((i) => i.getAsFile())
          .filter((f) => f != null) || [];
    } else if (event instanceof DragEvent && event.dataTransfer?.files) {
      files = Array.from(event.dataTransfer.files) || [];
    } else {
      files = Array.from((event.target as HTMLInputElement).files || []);
    }

    const filteredFiles = [...files].filter(
      (f) => f.name.match('_fill.') || f.name.match('_color.')
    );

    const result = await this.#processFiles(filteredFiles);
    if (result[0] === true) {
      // resolve();
      this.onImageRead.emit(this.board);
    } else if (result[0] === false) {
      // reject(result[1]);
    }
  }

  async #processFiles(files: File[]): Promise<any> {
    let result: any = [null];

    for await (const file of files) {
      const fileName = file.name;

      const imgSrc = await this.#readAsDataURL(file);
      const img = await this.#loadImage(imgSrc);

      const ctx = document.createElement('canvas').getContext('2d');
      if (!ctx) return [null];
      ctx.drawImage(img, 0, 0);

      const pixels = ctx.getImageData(0, 0, img.width, img.height).data;

      if (this.board.width == 0 || this.board.height == 0) {
        this.board.width = img.width;
        this.board.height = img.height;
      } else if (this.board.width != img.width || this.board.height != img.height) {
        result = [
          false,
          `El ancho o alto de las imagenes no cuadran.
            - Tamaño de la primera imagen: ${this.board.width} x ${this.board.height}.
            - Tamaño de la segunda imagen: ${img.width} x ${img.height}.`,
        ];
      }

      this.board.name = fileName.split('_')[0]

      if (fileName.match('_fill.')) {
        this.board.filledTiles = [];
      } else if (fileName.match('_color.')) {
        this.board.coloredTiles = [];
      }

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const hex = this.rgbToHex(r, g, b);

        if (fileName.match('_fill.')) {
          if (hex == '#000000') this.board.filledTiles?.push(1);
          else this.board.filledTiles?.push(0);
        } else if (fileName.match('_color.')) {
          this.board.coloredTiles?.push(hex);
        }
      }
      if (
        this.board.filledTiles?.length || 0 > 0 &&
        this.board.coloredTiles?.length || 0 > 0 &&
        this.board.width || 0 > 0 &&
        this.board.height || 0 > 0
      ) {
        result = [true];
      }
    }

    return result;
  }

  rgbToHex(r: number, g: number, b: number) {
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
}
