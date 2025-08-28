import {
  Component,
  computed,
  inject,
  input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { GameTilesNumber } from '../../interfaces/game-axis-numbers';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';
import { ImgBoardComponent } from '../../components/img-board/img-board.component';
import { Game, Tile, voidGame } from '../../interfaces/game.interface';
import {
  CheckGameWin,
  voidCheckGameWin,
} from '../../interfaces/check-game-win.interface';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { GameBoardComponent } from '../../components/game-board/game-board.component';
import { catchError, lastValueFrom, of } from 'rxjs';
import { ServerResponse } from '../../interfaces/server-response.interface';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameBoardComponent, RouterLink],
  templateUrl: './game-copy.component.html',
  styleUrl: './game-copy.component.css',
})
export class GameCopyComponent {
  private loadingWin = false;
  private isMouseDown = false;
  private currentTileIndex = 0;
  private initialTile: Tile = 0;
  private initialTileX = 0;
  private initialTileY = 0;
  private isDragAxisX: boolean | null = null;
  private changedTileIndexes: number[] = [];
  private autoCompletedIdxs: number[] = [];

  game: Game = voidGame();

  gameWin: CheckGameWin = voidCheckGameWin();

  gameTiles: WritableSignal<Tile[]> = signal([]);

  private filledColumnNumbers: WritableSignal<number[][]> = signal([]);
  private filledRowNumbers: WritableSignal<number[][]> = signal([]);

  columnNumbers: Signal<GameTilesNumber[][]> = computed(() => {
    if (this.gameTiles().length === 0) return [];

    let ftn: GameTilesNumber[][] = [];
    this.filledColumnNumbers().forEach((cn, x) => {
      const columnGameTiles = this.getColumnTiles(this.gameTiles(), x);
      const completedNumbers = this.getCompletedTilesNumbers(
        cn,
        columnGameTiles,
      );
      ftn.push(completedNumbers);
    });
    return ftn;
  });

  rowNumbers: Signal<GameTilesNumber[][]> = computed(() => {
    if (this.gameTiles().length === 0) return [];

    let ftn: GameTilesNumber[][] = [];
    this.filledRowNumbers().forEach((rn, y) => {
      const rowGameTiles = this.getRowTiles(this.gameTiles(), y);
      const completedNumbers = this.getCompletedTilesNumbers(rn, rowGameTiles);
      ftn.push(completedNumbers);
    });
    return ftn;
  });

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private localStorageService = inject(LocalStorageService);

  ngOnInit() {
    let boardId = this.activatedRoute.snapshot.params['id'];
    console.log('board id', boardId)

    this.gameService.getNewGame(boardId).subscribe({
      next: (res) => {
        if (!res.ok) {
          console.log('not ok', res.error);
          //this.router.navigate(['/'], { state: { error: result.error } });
          return;
        }

        Object.assign(this.game, res.datos);

        this.filledColumnNumbers.set(res.datos.columnNumbers);
        this.filledRowNumbers.set(res.datos.rowNumbers);
        this.gameTiles.set(res.datos.gameTiles);

        this.useProgress();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private useProgress() {
    const games = this.localStorageService.getItem<any[]>('games');
    if (games == null) return;
    const progress = games.find((g) => g.level === this.game.level);
    if (progress === null) return;

    Object.assign(this.game, progress);
    this.gameTiles.set(this.game.gameTiles);
  }

  private clearProgress() {
    const games = this.localStorageService.getItem<any[]>('games');
    if (games == null) return;

    const newGames = games.filter((g) => g.level !== this.game.level);

    this.localStorageService.setItem('games', newGames);
  }

  private saveProgress() {
    if (this.gameWin.isWin) return;
    let games = this.localStorageService.getItem<any[]>('games');
    if (games == null) {
      games = [];
    }

    const getCurrentGame = () => {
      const gameTilesCount = this.getFilledTilesCounter(this.gameTiles());
      const progressRatio = parseFloat(
        (gameTilesCount / this.game.filledTilesNumber).toFixed(2),
      );

      return {
        level: this.game.level,
        history: this.game.history,
        gameTiles: this.gameTiles(),
        progressPorcentage: progressRatio * 100,
      };
    };

    const progress = games.find((g) => g.level === this.game.level);
    const index = games.findIndex((g) => g.level === this.game.level);
    if (progress == null) {
      games.push(getCurrentGame());
    } else {
      games[index] = getCurrentGame();
    }

    this.localStorageService.setItem('games', games);
  }

  checkGameWin() {
    if (
      this.getFilledTilesCounter(this.gameTiles()) !==
      this.game.filledTilesNumber
    ) {
      return;
    }

    this.gameService.checkGameWin(this.game.level, this.gameTiles()).subscribe({
      next: (result) => {
        if (!result.ok) {
          console.log('not ok', result.error);
          //this.router.navigate(['/'], { state: { error: result.error } });
          return;
        }

        Object.assign(this.gameWin, result.datos);

        if (!result.datos.isWin) {
          alert('Solution Not Found');
          return;
        }

        let completedLevels =
          this.localStorageService.getItem<string[]>('completedLevels') || [];

        if (!completedLevels.includes(result.datos.boardId)) {
          completedLevels.push(result.datos.boardId);
        }

        this.localStorageService.setItem<string[]>(
          'completedLevels',
          completedLevels,
        );

        this.clearProgress();
      },
      error: (err) => {
        console.error(err);
      },
    });
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

    this.saveProgress();

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

    this.saveProgress();
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

    this.checkGameWin();
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

    this.checkGameWin();
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
    return [x, y];
  }

  private getRowTiles(allTiles: Tile[], y: number): Tile[] {
    return allTiles.slice(
      this.game.width * y,
      this.game.width * y + this.game.width,
    );
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
    tiles: Tile[],
  ): GameTilesNumber[] {
    let numbers = filledTilesNumbers.map<GameTilesNumber>((n) => ({
      number: n,
      complete: false,
    }));

    const checkCompleteNumbers = (inverse = false) => {
      let checkedNumbers: GameTilesNumber[] = JSON.parse(
        JSON.stringify(numbers),
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
