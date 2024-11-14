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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';
import { ImgBoardComponent } from '../../components/img-board/img-board.component';
import { Game, voidGame } from '../../interfaces/game.interface';
import { CheckGameWin, voidCheckGameWin } from '../../interfaces/check-game-win.interface';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { GameBoardComponent } from '../../components/game-board/game-board.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NavbarComponent, ImgBoardComponent, GameBoardComponent, RouterLink],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  private loadingWin = false;
  private isMouseDown = false;
  private currentTileIndex = 0;
  private initialTile: Tile = 0;
  private initialTileX = 0;
  private initialTileY = 0;
  private isDragAxisX: boolean | null = null;
  private changedTileIndexes: number[] = [];
  private autoCompletedIdxs: number[] = [];

  game: Game = voidGame()

  gameWin: CheckGameWin = voidCheckGameWin()

  gameTiles: WritableSignal<Tile[]> = signal([]);

  private filledColumnNumbers: WritableSignal<number[][]> = signal([]);
  private filledRowNumbers: WritableSignal<number[][]> = signal([]);

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
  private activatedRoute = inject(ActivatedRoute)
  private gameService = inject(GameService);
  private localStorageService = inject(LocalStorageService);

  constructor() {
    let level = this.activatedRoute.snapshot.params['level'];
    level = parseInt(level)

    if (isNaN(level) || level < 0) {
      this.router.navigate(['/levels'], { state: { err: 'Incorrect level' } });
      return;
    }

    this.gameService.getNewGameByLevel(level).subscribe({
      next: (res) => {
        Object.assign(this.game, res.datos)

        this.filledColumnNumbers.set(res.datos.columnNumbers);
        this.filledRowNumbers.set(res.datos.rowNumbers);
        this.gameTiles.set(res.datos.gameTiles);
      },
      error: (err) => {
        console.log(err)
        this.router.navigate(['/levels'], { state: { err: err } });
        return;
      }
    });
  }

  checkGameWin() {
    if (this.getFilledTilesCounter(this.gameTiles()) !== this.game.filledTilesNumber)
      return;

    this.gameService.checkGameWin(this.game.level, this.gameTiles())
      .subscribe(res => {
        if (res.ok) {
          Object.assign(this.gameWin, res.datos)

          if (res.datos.isWin) {
            let completedLevels = this.localStorageService
              .getItem<string[]>('completedLevels')

            if (!completedLevels) completedLevels = [];

            completedLevels.push(res.datos.boardId);

            this.localStorageService
              .setItem<string[]>('completedLevels', completedLevels)
          } else {
            alert('Solution Not Found')
          }
        }
      })
  }

  onContextMenu(e: Event) {
    e.preventDefault();
  }

  onMouseUp() {
    if (!this.isMouseDown) return;
    this.game.history.push({
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

    if (this.loadingWin) return;

    if (e.target == null) return;
    const targetTileEl = e.target as HTMLElement;

    this.isMouseDown = true;
    this.currentTileIndex = this.getTileIndex(targetTileEl);
    this.initialTile = this.gameTiles()[this.currentTileIndex];
    this.initialTileX = this.currentTileIndex % this.game.width;
    this.initialTileY = Math.floor(this.currentTileIndex / this.game.width);

    const index = this.getTileIndex(targetTileEl);
    if (e.button === 0) this.click(index);
    if (e.button === 2) this.click(index, false);
  }

  onMouseMove(e: MouseEvent) {
    if (this.loadingWin) return;

    if (!this.isMouseDown) return;

    if (e.target == null) return;
    const targetTileEl = e.target as HTMLElement;

    const currentIndex = this.getTileIndex(targetTileEl);
    if (this.currentTileIndex === currentIndex) return;

    // lock axis
    let x = currentIndex % this.game.width;
    let y = Math.floor(currentIndex / this.game.width);

    if (x != this.initialTileX && this.isDragAxisX == null)
      this.isDragAxisX = true;
    else if (y != this.initialTileY && this.isDragAxisX == null)
      this.isDragAxisX = false;

    let index: number;
    if (this.isDragAxisX) {
      index = this.initialTileY * this.game.width + x;
    } else {
      index = y * this.game.width + this.initialTileX;
    }

    if (e.buttons === 1) this.drag(index, true);
    if (e.buttons === 2) this.drag(index, false);

    this.currentTileIndex = currentIndex;
  }

  onHistoryBack() {
    if (this.loadingWin) return;
    const lastHistory = this.game.history.pop();
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
    let tileX = tileIndex % this.game.width;
    let tileY = Math.floor(tileIndex / this.game.width);

    // column
    const columnFilledNumbers = this.filledColumnNumbers()[tileX];

    const columnGameTiles = this.getColumnTiles(this.gameTiles(), tileX);
    const columnGameNumbers = this.getFilledTilesNumbers(columnGameTiles);

    const isColumnComplete =
      columnFilledNumbers.length === columnGameNumbers.length &&
      columnFilledNumbers.every((n, i) => n == columnGameNumbers[i]);

    if (isColumnComplete) {
      for (let y = 0; y < this.game.height; y++) {
        const index = tileX + y * this.game.width;

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
      for (let x = 0; x < this.game.width; x++) {
        const index = x + tileY * this.game.width;

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

  getFilledTilesCounter(tiles: number[]) {
    return tiles.reduce((count, num) => (num === 1 ? count + 1 : count), 0);
  }

  getXY(index: number): [number, number] {
    let x = index % this.game.width;
    let y = Math.floor(index / this.game.width);
    return [x, y]
  }

  private getRowTiles(allTiles: Tile[], y: number): Tile[] {
    return allTiles.slice(this.game.width * y, this.game.width * y + this.game.width);
  }

  private getColumnTiles(allTiles: Tile[], x: number): Tile[] {
    const tiles: Tile[] = [];
    for (let y = 0; y < this.game.height; y++) {
      tiles.push(allTiles[this.game.width * y + x]);
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
