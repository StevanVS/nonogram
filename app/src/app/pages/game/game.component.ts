import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { Tile } from '../../interfaces/tile.interface';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  #isMouseDown = false;
  #currentTileIndex = 0;
  #currentTile: Tile = 0;
  #initialTile: Tile = 0;
  #initialTileX = 0;
  #initialTileY = 0;
  #isDragAxisX: boolean | null = null;
  private changedTileIndexes: number[] = []

  // investigar signal
  gameTiles: Tile[] = [1, -1, 1, 1, 1, 1, 0, 1, 0];

  filledTilesNumber: number = 6;

  history: { previus: Tile, current: Tile, indexes: number[] }[] = [];

  width: number = 3;
  height: number = 3;

  // investigar computed values: ver si se puden editar manualmente
  columnNumbers: { number: number, complete: boolean }[][] = [
    [{ number: 2, complete: true }],
    [{ number: 2, complete: false }],
    [{ number: 2, complete: false }]
  ];
  rowNumbers: { number: number, complete: boolean }[][] = [
    [{ number: 1, complete: true }, { number: 1, complete: true }],
    [{ number: 3, complete: false }],
    [{ number: 1, complete: false }]
  ];

  // Estas dos variables viene de base
  cn: number[][] = [
    [2], [2], [2]
  ]

  rn: number[][] = [
    [1, 1], [3], [1]
  ]


  onContextMenu(e: Event) { e.preventDefault() }

  onMouseUp(e: Event) {
    this.history.push({
      previus: this.#initialTile,
      current: this.#currentTile,
      indexes: [...this.changedTileIndexes],
    });

    this.#isMouseDown = false;
    this.#currentTileIndex = 0;
    this.#currentTile = 0;
    this.#initialTile = 0;
    this.#initialTileX = 0;
    this.#initialTileY = 0;
    this.#isDragAxisX = null;
    this.changedTileIndexes = []
  }

  onMouseDown(e: MouseEvent) {
    e.preventDefault()

    if (e.target == null) return;
    const targetTileEl = e.target as HTMLElement

    this.#isMouseDown = true;
    this.#currentTileIndex = this.#getTileIndex(targetTileEl);
    this.#initialTile = this.gameTiles[this.#currentTileIndex];
    this.#initialTileX = this.#currentTileIndex % this.width;
    this.#initialTileY = Math.floor(this.#currentTileIndex / this.width);

    const index = this.#getTileIndex(targetTileEl);
    if (e.button === 0) this.#click(index);
    if (e.button === 2) this.#click(index, false);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.#isMouseDown) return;

    if (e.target == null) return;
    const targetTileEl = e.target as HTMLElement

    const currentIndex = this.#getTileIndex(targetTileEl);
    if (this.#currentTileIndex === currentIndex) return;

    // lock axis
    let x = currentIndex % this.width;
    let y = Math.floor(currentIndex / this.width);

    if (x != this.#initialTileX && this.#isDragAxisX == null)
      this.#isDragAxisX = true;
    else if (y != this.#initialTileY && this.#isDragAxisX == null)
      this.#isDragAxisX = false;

    let index: number;
    if (this.#isDragAxisX) {
      index = this.#initialTileY * this.width + x;
    } else {
      index = y * this.width + this.#initialTileX;
    }

    if (e.buttons === 1) this.#drag(index, true);
    if (e.buttons === 2) this.#drag(index, false);

    this.#currentTileIndex = currentIndex;
  }

  onHistoryBack() {
    const lastHistory = this.history.pop();
    if (lastHistory == null) return;
    lastHistory.indexes.forEach((i) => {
      this.gameTiles[i] = lastHistory.previus
    })
  }

  #click(index: number, fill = true) {
    if (this.gameTiles[index] == 1 && fill) {
      this.gameTiles[index] = 0;
      this.changedTileIndexes.push(index);
    }
    else if (this.gameTiles[index] == -1 && !fill) {
      this.gameTiles[index] = 0;
      this.changedTileIndexes.push(index);
    }
    else {
      this.gameTiles[index] = fill ? 1 : -1;
      this.changedTileIndexes.push(index);
    }

    //if (fill) this.#autoComplete(tileEl);
  }

  #drag(index: number, fill = true) {

    if (this.#initialTile == 1 && this.gameTiles[index] == 1) {
      this.gameTiles[index] = fill ? 0 : -1;
      this.changedTileIndexes.push(index);
    } else if (this.#initialTile == -1 && this.gameTiles[index] == -1) {
      this.gameTiles[index] = fill ? 1 : 0;
      this.changedTileIndexes.push(index);
    } else if (
      this.#initialTile == 0 &&
      this.#initialTile == this.gameTiles[index]
    ) {
      this.gameTiles[index] = fill ? 1 : -1;
      this.changedTileIndexes.push(index);
    }

    //if (fill) this.#autoComplete(tileEl);
  }

  #getTileIndex(tileEl: HTMLElement) {
    return Number(tileEl.getAttribute("data-index"));
  }

  isGroupNumbersComplete(groupNumbers: { number: number, complete: boolean }[]) {
    return groupNumbers.every(n => n.complete)
  }

  getFilledTilesCounter(tiles: number[]) {
    return tiles.reduce((prev, curr) => {
      if (prev == -1 && curr == -1) return 0;
      return curr == -1 ? prev : prev + curr;
    });
  }

}
