import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { Tile } from '../../interfaces/tile.interface';
import { FilledTilesNumber } from '../../interfaces/filledTilesNumber.interface';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  private isMouseDown = false;
  private currentTileIndex = 0;
  private initialTile: Tile = 0;
  private initialTileX = 0;
  private initialTileY = 0;
  private isDragAxisX: boolean | null = null;
  private changedTileIndexes: number[] = []


  gameTiles: WritableSignal<Tile[]> = signal([1, -1, 1, 1, 1, 1, 0, 1, -1]);

  history: { previous: Tile, indexes: number[] }[] = [];

  // Estas tres variables viene de base
  filledTilesNumber: number = 6;

  private filledColumnNumbers: number[][] = [
    [2], [2], [2]
  ]

  private filledRowNumbers: number[][] = [
    [1, 1], [3], [1]
  ]

  width: number = 3;
  height: number = 3;

  columnNumbers: Signal<FilledTilesNumber[][]> = computed(() => {
    let ftn: FilledTilesNumber[][] = [];
    this.filledColumnNumbers.forEach((cn, x) => {
      const columnGameTiles = this.getColumnTiles(this.gameTiles(), x);
      const completedNumbers = this.getCompletedTilesNumbers(cn, columnGameTiles);
      ftn.push(completedNumbers)
    })
    return ftn;
  })

  rowNumbers: Signal<FilledTilesNumber[][]> = computed(() => {
    let ftn: FilledTilesNumber[][] = [];
    this.filledRowNumbers.forEach((rn, y) => {
      const rowGameTiles = this.getRowTiles(this.gameTiles(), y);
      const completedNumbers = this.getCompletedTilesNumbers(rn, rowGameTiles);
      ftn.push(completedNumbers)
    })
    return ftn;
  })

  onContextMenu(e: Event) { e.preventDefault() }

  onMouseUp(e: Event) {
    this.history.push({
      previous: this.initialTile,
      indexes: [...this.changedTileIndexes],
    });

    this.isMouseDown = false;
    this.currentTileIndex = 0;
    this.initialTile = 0;
    this.initialTileX = 0;
    this.initialTileY = 0;
    this.isDragAxisX = null;
    this.changedTileIndexes = []
  }

  onMouseDown(e: MouseEvent) {
    e.preventDefault()

    if (e.target == null) return;
    const targetTileEl = e.target as HTMLElement

    this.isMouseDown = true;
    this.currentTileIndex = this.getTileIndex(targetTileEl);
    this.initialTile = this.gameTiles()[this.currentTileIndex];
    this.initialTileX = this.currentTileIndex % this.width;
    this.initialTileY = Math.floor(this.currentTileIndex / this.width);

    const index = this.getTileIndex(targetTileEl);
    if (e.button === 0) this.click(index);
    if (e.button === 2) this.click(index, false);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isMouseDown) return;

    if (e.target == null) return;
    const targetTileEl = e.target as HTMLElement

    const currentIndex = this.getTileIndex(targetTileEl);
    if (this.currentTileIndex === currentIndex) return;

    // lock axis
    let x = currentIndex % this.width;
    let y = Math.floor(currentIndex / this.width);

    if (x != this.initialTileX && this.isDragAxisX == null)
      this.isDragAxisX = true;
    else if (y != this.initialTileY && this.isDragAxisX == null)
      this.isDragAxisX = false;

    let index: number;
    if (this.isDragAxisX) {
      index = this.initialTileY * this.width + x;
    } else {
      index = y * this.width + this.initialTileX;
    }

    if (e.buttons === 1) this.drag(index, true);
    if (e.buttons === 2) this.drag(index, false);

    this.currentTileIndex = currentIndex;
  }

  onHistoryBack() {
    const lastHistory = this.history.pop();
    if (lastHistory == null) return;
    lastHistory.indexes.forEach((i) => {
      this.gameTiles.update(arr => this.updateArray(arr, i, lastHistory.previous))
      //this.gameTiles[i] = lastHistory.previous
    })
  }

  click(index: number, fill = true) {
    if ((this.gameTiles()[index] == 1 && fill) || (this.gameTiles()[index] == -1 && !fill)) {
      this.gameTiles.update(arr => this.updateArray(arr, index, 0))
      //this.gameTiles[index] = 0;
      this.changedTileIndexes.push(index);
    }
    else {
      this.gameTiles.update(arr => this.updateArray(arr, index, fill ? 1 : -1))
      //this.gameTiles[index] = fill ? 1 : -1;
      this.changedTileIndexes.push(index);
    }

    //if (fill) this.autoComplete(tileEl);
  }

  drag(index: number, fill = true) {
    if (this.initialTile == 1 && this.gameTiles()[index] == 1) {
      this.gameTiles.update(arr => this.updateArray(arr, index, fill ? 0 : -1))
      //this.gameTiles[index] = fill ? 0 : -1;
      this.changedTileIndexes.push(index);
    } else if (this.initialTile == -1 && this.gameTiles()[index] == -1) {
      this.gameTiles.update(arr => this.updateArray(arr, index, fill ? 1 : 0))
      //this.gameTiles[index] = fill ? 1 : 0;
      this.changedTileIndexes.push(index);
    } else if (
      this.initialTile == 0 &&
      this.initialTile == this.gameTiles()[index]
    ) {
      this.gameTiles.update(arr => this.updateArray(arr, index, fill ? 1 : -1))
      //this.gameTiles[index] = fill ? 1 : -1;
      this.changedTileIndexes.push(index);
    }

    //if (fill) this.autoComplete(tileEl);
  }

  getTileIndex(tileEl: HTMLElement) {
    return Number(tileEl.getAttribute("data-index"));
  }

  private updateArray<T>(array: T[], index: number, newValue: T): T[] {
    return [...array.slice(0, index), newValue, ...array.slice(index + 1)]
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

  private getRowTiles(allTiles: Tile[], y: number): Tile[] {
    return allTiles.slice(this.width * y, this.width * y + this.width);
  }

  private getColumnTiles(allTiles: Tile[], x: number): Tile[] {
    const tiles: Tile[] = [];
    for (let y = 0; y < this.height; y++) {
      tiles.push(allTiles[this.width * y + x]);
    }
    return tiles;
  }

  private getFilledTilesNumbers(tiles: Tile[]): number[] {
    const filledTilesNumbers = [];

    let counter = 0;

    tiles.forEach((tile, i, arr) => {
      if (tile == 1) {
        counter++;
      }
      if ((tile == 0 || tile == -1 || i + 1 === arr.length) && counter > 0) {
        filledTilesNumbers.push(counter);
        counter = 0;
      }
    });

    if (filledTilesNumbers.length == 0) filledTilesNumbers.push(0);

    return filledTilesNumbers;
  }

  private getCompletedTilesNumbers(filledTilesNumbers: number[], tiles: Tile[]): FilledTilesNumber[] {
    let numbers = filledTilesNumbers.map<FilledTilesNumber>((n) => ({
      number: n,
      complete: false,
    }));

    const checkCompleteNumbers = (inverse = false) => {
      let checkedNumbers: FilledTilesNumber[] = JSON.parse(JSON.stringify(numbers));
      let checkGameTiles: Tile[] = JSON.parse(JSON.stringify(tiles));

      if (inverse) {
        checkedNumbers.reverse();
        checkGameTiles.reverse();
      }

      let filledNumbersIndex = 0;

      let baseCounter = 0;
      let counter = 0;

      checkGameTiles.forEach((t, i) => {
        if (filledNumbersIndex >= checkedNumbers.length) return;

        if (t == -1) baseCounter++;

        if (t == 1) {
          if (baseCounter === i) {
            counter++;
          }
          baseCounter++;
        }

        if (
          (t == 0 || t == -1 || i + 1 === checkGameTiles.length) &&
          counter > 0
        ) {
          const number = checkedNumbers[filledNumbersIndex].number;
          if (number == counter) {
            checkedNumbers[filledNumbersIndex].complete = true;
            filledNumbersIndex++;
          }
          counter = 0;
        }
      });

      if (inverse) {
        checkedNumbers.reverse();
        checkGameTiles.reverse();
      }

      return checkedNumbers;
    };

    numbers = checkCompleteNumbers();

    if (tiles.includes(0)) {
      numbers = checkCompleteNumbers(true);
    }

    return numbers;
  }
}
