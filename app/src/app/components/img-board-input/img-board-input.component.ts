import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImgBoard } from '../../interfaces/img-board';
import { NgClass } from '@angular/common';
import { ImgBoardComponent } from '../img-board/img-board.component';

@Component({
  selector: 'app-img-board-input',
  imports: [NgClass, ImgBoardComponent],
  templateUrl: './img-board-input.component.html',
  styleUrl: './img-board-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImgBoardInputComponent),
      multi: true,
    },
  ],
})
export class ImgBoardInputComponent implements ControlValueAccessor {
  tileType = input.required<'coloredTiles' | 'filledTiles'>();

  private onChange: any = () => {};
  private onTouched: any = () => {};

  imgBoard: ImgBoard | null = null;

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

    // console.log('Archivo recibido:', file);

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

    let tiles: string[] | number[] = [];

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      const hex = this.#rgbToHex(r, g, b);

      if (this.tileType() === 'filledTiles') {
        if (hex == '#000000') (tiles as number[]).push(1);
        else (tiles as number[]).push(0);
      } else {
        (tiles as string[]).push(hex);
      }
    }

    this.setImage({
      tiles: tiles,
      width: img.width,
      height: img.height,
    });
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

  setImage(processedImage: ImgBoard) {
    this.imgBoard = processedImage;
    this.onChange(this.imgBoard);
    this.onTouched();
  }

  clearImage() {
    this.imgBoard = null;
    this.onChange(this.imgBoard);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.imgBoard = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
