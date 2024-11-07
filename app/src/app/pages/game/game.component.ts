import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Tile } from '../../interfaces/tile.interface';
import { FilledTilesNumber } from '../../interfaces/filledTilesNumber.interface';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { GameHistory } from '../../interfaces/gameHistory.interface';
import { ImgBoardComponent } from '../../components/img-board/img-board.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ImgBoardComponent, NgTemplateOutlet],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  private isMouseDown = false;
  private currentTileIndex = 0;
  private initialTile: Tile = 0;
  private initialTileX = 0;
  private initialTileY = 0;
  private isDragAxisX: boolean | null = null;
  private changedTileIndexes: number[] = [];
  private autoCompletedIdxs: number[] = [];

  private boardId: string = '';

  isWin: boolean = false;

  gameTiles: WritableSignal<Tile[]> = signal([]);

  private filledColumnNumbers: WritableSignal<number[][]> = signal([]);
  private filledRowNumbers: WritableSignal<number[][]> = signal([]);

  history: GameHistory[] = [];

  filledTilesNumber: number = 0;
  coloredTiles: string[] = [];

  width: number = 0;
  height: number = 0;
  innerColumn: number = 0;
  innerRow: number = 0;

  columnNumbers: Signal<FilledTilesNumber[][]> = computed(() => {
    if (this.gameTiles().length === 0) return [];

    let ftn: FilledTilesNumber[][] = [];
    this.filledColumnNumbers().forEach((cn, x) => {
      const columnGameTiles = this.getColumnTiles(this.gameTiles(), x);
      const completedNumbers = this.getCompletedTilesNumbers(
        cn,
        columnGameTiles
      );
      ftn.push(completedNumbers);
    });
    return ftn;
  });

  rowNumbers: Signal<FilledTilesNumber[][]> = computed(() => {
    if (this.gameTiles().length === 0) return [];

    let ftn: FilledTilesNumber[][] = [];
    this.filledRowNumbers().forEach((rn, y) => {
      const rowGameTiles = this.getRowTiles(this.gameTiles(), y);
      const completedNumbers = this.getCompletedTilesNumbers(rn, rowGameTiles);
      ftn.push(completedNumbers);
    });
    return ftn;
  });

  private router = inject(Router);
  private gameService = inject(GameService);

  constructor() {
    this.boardId =
      this.router.getCurrentNavigation()?.extras.state?.['boardId'];

    if (this.boardId == null) {
      this.router.navigate(['/']);
      return;
    }

    this.gameService.getNewGame(this.boardId).subscribe((res) => {
      this.width = res.datos.width;
      this.height = res.datos.height;
      this.innerColumn = res.datos.innerColumn;
      this.innerRow = res.datos.innerRow;
      this.filledColumnNumbers.set(res.datos.columnNumbers);
      this.filledRowNumbers.set(res.datos.rowNumbers);
      this.gameTiles.set(res.datos.gameTiles);
      this.filledTilesNumber = res.datos.filledTilesNumber;
      this.history = res.datos.history;
    });
  }

  checkGameWin() {
    if (this.getFilledTilesCounter(this.gameTiles()) !== this.filledTilesNumber)
      return;

    this.gameService.checkGameWin(this.boardId, this.gameTiles()).subscribe(res => {
      if (res.ok) {
        setTimeout(() => {
          this.isWin = res.datos.isWin;
          if (res.datos.isWin) {
            this.coloredTiles = res.datos.coloredTiles;
          } else {
            alert('Solution Not Found')
          }
        }, 500);

      }
    })
  }

  onContextMenu(e: Event) {
    e.preventDefault();
  }

  onMouseUp() {
    if (!this.isMouseDown) return;
    this.history.push({
      previous: this.initialTile,
      indexes: [...this.changedTileIndexes],
      autoCompletedIdxs: [...this.autoCompletedIdxs],
    });

    this.isMouseDown = false;
    this.currentTileIndex = 0;
    this.initialTile = 0;
    this.initialTileX = 0;
    this.initialTileY = 0;
    this.isDragAxisX = null;
    this.changedTileIndexes = [];
    this.autoCompletedIdxs = [];
  }

  onMouseDown(e: MouseEvent) {
    e.preventDefault();

    if (e.target == null) return;
    const targetTileEl = e.target as HTMLElement;

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
    const targetTileEl = e.target as HTMLElement;

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
      this.updateGameTiles(i, lastHistory.previous);
    });
    lastHistory.autoCompletedIdxs.forEach((i) => {
      this.updateGameTiles(i, 0);
    });
  }

  click(index: number, fill = true) {
    const initTile: Tile = this.gameTiles()[index];

    if ((initTile == 1 && fill) || (initTile == -1 && !fill)) {
      this.updateGameTiles(index, 0);
      //this.gameTiles[index] = 0;
      this.changedTileIndexes.push(index);
    } else {
      this.updateGameTiles(index, fill ? 1 : -1);
      //this.gameTiles[index] = fill ? 1 : -1;
      this.changedTileIndexes.push(index);
    }

    if (fill || initTile === 1) {
      this.autoComplete(index);
    }

    this.checkGameWin()
  }

  drag(index: number, fill = true) {
    const initTile: Tile = this.gameTiles()[index];

    if (this.initialTile == 1 && initTile == 1) {
      this.updateGameTiles(index, fill ? 0 : -1);
      //this.gameTiles[index] = fill ? 0 : -1;
      this.changedTileIndexes.push(index);
    } else if (this.initialTile == -1 && initTile == -1) {
      this.updateGameTiles(index, fill ? 1 : 0);
      //this.gameTiles[index] = fill ? 1 : 0;
      this.changedTileIndexes.push(index);
    } else if (this.initialTile == 0 && this.initialTile == initTile) {
      this.updateGameTiles(index, fill ? 1 : -1);
      //this.gameTiles[index] = fill ? 1 : -1;
      this.changedTileIndexes.push(index);
    }

    if (fill || initTile === 1) {
      this.autoComplete(index);
    }

    this.checkGameWin()
  }

  private autoComplete(tileIndex: number) {
    let tileX = tileIndex % this.width;
    let tileY = Math.floor(tileIndex / this.width);

    // column
    const columnFilledNumbers = this.filledColumnNumbers()[tileX];

    const columnGameTiles = this.getColumnTiles(this.gameTiles(), tileX);
    const columnGameNumbers = this.getFilledTilesNumbers(columnGameTiles);

    const isColumnComplete =
      columnFilledNumbers.length === columnGameNumbers.length &&
      columnFilledNumbers.every((n, i) => n == columnGameNumbers[i]);

    if (isColumnComplete) {
      for (let y = 0; y < this.height; y++) {
        const index = tileX + y * this.width;

        if (this.gameTiles()[index] == 0) {
          this.autoCompletedIdxs.push(index);
          this.updateGameTiles(index, -1);
        }
      }
    }

    // row
    const rowFilledNumbers = this.filledRowNumbers()[tileY];

    const rowGameTiles = this.getRowTiles(this.gameTiles(), tileY);
    const rowGameNumbers = this.getFilledTilesNumbers(rowGameTiles);

    const isRowComplete =
      rowFilledNumbers.length === rowGameNumbers.length &&
      rowFilledNumbers.every((n, i) => n == rowGameNumbers[i]);

    if (isRowComplete) {
      for (let x = 0; x < this.width; x++) {
        const index = x + tileY * this.width;

        if (this.gameTiles()[index] == 0) {
          this.autoCompletedIdxs.push(index);
          this.updateGameTiles(index, -1);
        }
      }
    }
  }

  getTileIndex(tileEl: HTMLElement) {
    return Number(tileEl.getAttribute('data-index'));
  }

  private updateGameTiles(index: number, value: Tile): void {
    this.gameTiles.update((array) => {
      const arr: Tile[] = JSON.parse(JSON.stringify(array));
      arr[index] = value;
      return arr;
    });
  }

  isGroupNumbersComplete(
    groupNumbers: { number: number; complete: boolean }[]
  ) {
    return groupNumbers.every((n) => n.complete);
  }

  getThickBorder(index: number) {
    const [x, y] = this.getXY(index)
    const border = '2px solid'

    let borderX = {}
    if (this.innerColumn > 0 && this.innerColumn !== this.width) {
      borderX = {
        borderRight: x % this.innerColumn === this.innerColumn - 1 ? border : '',
        borderLeft: x % this.innerColumn === 0 ? border : '',
      }
    }

    let borderY = {}
    if (this.innerRow > 0 && this.innerRow !== this.height) {
      borderY = {
        borderTop: y % this.innerRow === 0 ? border : '',
        borderBottom: y % this.innerRow === this.innerRow - 1 ? border : ''
      }
    }

    return {
      ...borderX,
      ...borderY,
    }
  }

  getFilledTilesCounter(tiles: number[]) {
    return tiles.reduce((count, num) => (num === 1 ? count + 1 : count), 0);
  }

  getXY(index: number): [number, number] {
    let x = index % this.width;
    let y = Math.floor(index / this.width);
    return [x, y]
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

  private getFilledTilesNumbers(tiles: Tile[]) {
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

  private getCompletedTilesNumbers(
    filledTilesNumbers: number[],
    tiles: Tile[]
  ): FilledTilesNumber[] {
    let numbers = filledTilesNumbers.map<FilledTilesNumber>((n) => ({
      number: n,
      complete: false,
    }));

    const checkCompleteNumbers = (inverse = false) => {
      let checkedNumbers: FilledTilesNumber[] = JSON.parse(
        JSON.stringify(numbers)
      );
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
