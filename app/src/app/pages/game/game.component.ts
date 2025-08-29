import {
  Component,
  computed,
  inject,
  Renderer2,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  GameAxisNumbers,
  GameTilesNumber,
  GameGroupNumber,
} from '../../interfaces/game-axis-numbers';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game, Tile, voidGame } from '../../interfaces/game.interface';
import { LocalStorageService } from '../../services/local-storage.service';
import { Board, voidBoard } from '../../interfaces/board.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  imports: [NgClass],
})
export class GameComponent {
  private loadingWin = false;
  private isMouseDown = false;
  private activePointerId: number | null = null;
  private currentTileIndex = 0;
  private initialTile: Tile = 0;
  private initialTileX = 0;
  private initialTileY = 0;
  private isDragAxisX: boolean | null = null;
  private changedTileIndexes: number[] = [];
  private autoCompletedIdxs: number[] = [];

  board: Board = {
    id: '68ad4e0bc53f066de2986551',
    name: 'Tree',
    width: 5,
    height: 5,
    filledTiles: [
      0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0,
    ],
    coloredTiles: [
      '#94daff',
      '#94daff',
      '#057c02',
      '#94daff',
      '#94daff',
      '#94daff',
      '#be67ff',
      '#057c02',
      '#057c02',
      '#94daff',
      '#94daff',
      '#057c02',
      '#057c02',
      '#fff400',
      '#94daff',
      '#057c02',
      '#ff0000',
      '#057c02',
      '#057c02',
      '#057c02',
      '#94daff',
      '#94daff',
      '#5a3a0a',
      '#94daff',
      '#94daff',
    ],
    order: 1,
    subGrid: 0,
    filledTilesCount: 12,
    columnNumbers: [[1], [3], [5], [1, 1], [1]],
    rowNumbers: [[1], [3], [2], [5], [1]],
  };

  game: Game = {
    id: '68ad4e0bc53f066de2986551',
    gameTiles: Array.from<Tile>({ length: 5 * 5 }).map((t, i) =>
      i % 3 == 0 ? 1 : i % 2 == 0 ? 0 : -1,
    ),
    history: [],
  };

  // gameWin: CheckGameWin = voidCheckGameWin();

  isCursorBlock = true;

  gameTiles: WritableSignal<Tile[]> = signal([]);

  gameFilledTilesCounter: Signal<number> = computed(() => {
    return this.gameTiles().reduce<number>(
      (count, num) => (num === 1 ? count + 1 : count),
      0,
    );
  });

  gameColumnNumbers: Signal<GameAxisNumbers> = computed(() => {
    if (this.gameTiles().length === 0) return [];
    let gameAxisNumbers: GameAxisNumbers = [];
    this.board.columnNumbers.forEach((groupNumber, x) => {
      const columnGameTiles = this.getColumnTiles(this.gameTiles(), x);
      const gameGroupNumber = this.getGameGroupNumber(
        groupNumber,
        columnGameTiles,
      );
      gameAxisNumbers.push(gameGroupNumber);
    });
    return gameAxisNumbers;
  });

  gameRowNumbers: Signal<GameAxisNumbers> = computed(() => {
    if (this.gameTiles().length === 0) return [];
    let gameAxisNumbers: GameAxisNumbers = [];
    this.board.rowNumbers.forEach((groupNumber, y) => {
      const rowGameTiles = this.getRowTiles(this.gameTiles(), y);
      const gameGroupNumber = this.getGameGroupNumber(
        groupNumber,
        rowGameTiles,
      );
      gameAxisNumbers.push(gameGroupNumber);
    });
    return gameAxisNumbers;
  });

  private renderer = inject(Renderer2);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private localStorageService = inject(LocalStorageService);

  constructor() {
    this.gameTiles.set(Array.from<Tile>({ length: 5 * 5 }).fill(0));
  }

  // ngOnInit() {
  //   let boardId = this.activatedRoute.snapshot.params['id'];
  //   console.log('board id', boardId);

  //   this.gameService.getNewGame(boardId).subscribe({
  //     next: (res) => {
  //       if (!res.ok) {
  //         console.log('not ok', res.error);
  //         //this.router.navigate(['/'], { state: { error: result.error } });
  //         return;
  //       }

  //       Object.assign(this.game, res.datos);

  //       this.filledColumnNumbers.set(res.datos.columnNumbers);
  //       this.filledRowNumbers.set(res.datos.rowNumbers);
  //       this.gameTiles.set(res.datos.gameTiles);

  //       this.useProgress();
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     },
  //   });
  // }

  // private useProgress() {
  //   const games = this.localStorageService.getItem<any[]>('games');
  //   if (games == null) return;
  //   const progress = games.find((g) => g.level === this.game.level);
  //   if (progress === null) return;

  //   Object.assign(this.game, progress);
  //   this.gameTiles.set(this.game.gameTiles);
  // }

  // private clearProgress() {
  //   const games = this.localStorageService.getItem<any[]>('games');
  //   if (games == null) return;

  //   const newGames = games.filter((g) => g.level !== this.game.level);

  //   this.localStorageService.setItem('games', newGames);
  // }

  private saveProgress() {
    // if (this.gameWin.isWin) return;
    // let games = this.localStorageService.getItem<any[]>('games');
    // if (games == null) {
    //   games = [];
    // }
    // const getCurrentGame = () => {
    //   const gameTilesCount = this.getFilledTilesCounter(this.gameTiles());
    //   const progressRatio = parseFloat(
    //     (gameTilesCount / this.game.filledTilesNumber).toFixed(2),
    //   );
    //   return {
    //     level: this.game.level,
    //     history: this.game.history,
    //     gameTiles: this.gameTiles(),
    //     progressPorcentage: progressRatio * 100,
    //   };
    // };
    // const progress = games.find((g) => g.level === this.game.level);
    // const index = games.findIndex((g) => g.level === this.game.level);
    // if (progress == null) {
    //   games.push(getCurrentGame());
    // } else {
    //   games[index] = getCurrentGame();
    // }
    // this.localStorageService.setItem('games', games);
  }

  checkGameWin() {
    // if (
    //   this.getFilledTilesCounter(this.gameTiles()) !==
    //   this.game.filledTilesNumber
    // ) {
    //   return;
    // }
    // this.gameService.checkGameWin(this.game.level, this.gameTiles()).subscribe({
    //   next: (result) => {
    //     if (!result.ok) {
    //       console.log('not ok', result.error);
    //       //this.router.navigate(['/'], { state: { error: result.error } });
    //       return;
    //     }
    //     Object.assign(this.gameWin, result.datos);
    //     if (!result.datos.isWin) {
    //       alert('Solution Not Found');
    //       return;
    //     }
    //     let completedLevels =
    //       this.localStorageService.getItem<string[]>('completedLevels') || [];
    //     if (!completedLevels.includes(result.datos.boardId)) {
    //       completedLevels.push(result.datos.boardId);
    //     }
    //     this.localStorageService.setItem<string[]>(
    //       'completedLevels',
    //       completedLevels,
    //     );
    //     this.clearProgress();
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   },
    // });
  }

  onChangeCursor() {
    this.isCursorBlock = !this.isCursorBlock;
  }

  onContextMenu(e: Event) {
    e.preventDefault();
  }

  onMouseUp(e: PointerEvent) {
    if (!this.isMouseDown) return;
    if (e.pointerId !== this.activePointerId) return;

    this.game.history.push({
      previous: this.initialTile,
      indexes: [...this.changedTileIndexes],
      autoCompletedIdxs: [...this.autoCompletedIdxs],
    });

    this.saveProgress();

    this.isMouseDown = false;
    this.activePointerId = null;
    this.currentTileIndex = 0;
    this.initialTile = 0;
    this.initialTileX = 0;
    this.initialTileY = 0;
    this.isDragAxisX = null;
    this.changedTileIndexes = [];
    this.autoCompletedIdxs = [];
  }

  onMouseDown(e: PointerEvent) {
    e.preventDefault();

    if (this.loadingWin) return;

    const targetTileEl = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest('.tile') as HTMLElement | null;
    if (targetTileEl == null) return;

    if (this.activePointerId !== null) return; // ya hay un dedo activo
    this.activePointerId = e.pointerId;

    this.isMouseDown = true;
    this.currentTileIndex = this.getTileIndex(targetTileEl);
    this.initialTile = this.gameTiles()[this.currentTileIndex];
    this.initialTileX = this.currentTileIndex % this.board.width;
    this.initialTileY = Math.floor(this.currentTileIndex / this.board.width);

    const index = this.getTileIndex(targetTileEl);
    if (e.buttons === 1) this.click(index, this.isCursorBlock);
    if (e.buttons === 2) this.click(index, !this.isCursorBlock);
  }

  onMouseMove(e: PointerEvent) {
    e.preventDefault();

    if (this.loadingWin) return;
    if (!this.isMouseDown) return;
    if (e.pointerId !== this.activePointerId) return;

    const targetTileEl = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest('.tile') as HTMLElement | null;
    if (targetTileEl == null) return;

    const currentIndex = this.getTileIndex(targetTileEl);
    if (this.currentTileIndex === currentIndex) return;

    // lock axis
    let x = currentIndex % this.board.width;
    let y = Math.floor(currentIndex / this.board.width);

    if (x != this.initialTileX && this.isDragAxisX == null)
      this.isDragAxisX = true;
    else if (y != this.initialTileY && this.isDragAxisX == null)
      this.isDragAxisX = false;

    let index: number;
    if (this.isDragAxisX) {
      index = this.initialTileY * this.board.width + x;
    } else {
      index = y * this.board.width + this.initialTileX;
    }

    if (e.buttons === 1) this.drag(index, this.isCursorBlock);
    if (e.buttons === 2) this.drag(index, !this.isCursorBlock);

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
      this.changedTileIndexes.push(index);
    } else {
      this.updateGameTiles(index, fill ? 1 : -1);
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
      this.changedTileIndexes.push(index);
    } else if (this.initialTile == -1 && initTile == -1) {
      this.updateGameTiles(index, fill ? 1 : 0);
      this.changedTileIndexes.push(index);
    } else if (this.initialTile == 0 && this.initialTile == initTile) {
      this.updateGameTiles(index, fill ? 1 : -1);
      this.changedTileIndexes.push(index);
    }

    if (fill || initTile === 1) {
      this.autoComplete(index);
    }

    this.checkGameWin();
  }

  private autoComplete(tileIndex: number) {
    let tileX = tileIndex % this.board.width;
    let tileY = Math.floor(tileIndex / this.board.width);

    // column
    const gameColumnGroupNumber = this.gameColumnNumbers()[tileX];

    const columnGameTiles = this.getColumnTiles(this.gameTiles(), tileX);
    const columnGameNumbers = this.getFilledTilesNumbers(columnGameTiles);

    const isColumnComplete =
      gameColumnGroupNumber.gameTilesNumbers.length ===
        columnGameNumbers.length &&
      gameColumnGroupNumber.gameTilesNumbers.every(
        (n, i) => n.number == columnGameNumbers[i],
      );

    if (isColumnComplete) {
      for (let y = 0; y < this.board.height; y++) {
        const index = tileX + y * this.board.width;

        if (this.gameTiles()[index] == 0) {
          this.autoCompletedIdxs.push(index);
          this.updateGameTiles(index, -1);
        }
      }
    }

    // row
    const gameRowGroupNumber = this.gameRowNumbers()[tileY];

    const rowGameTiles = this.getRowTiles(this.gameTiles(), tileY);
    const rowGameNumbers = this.getFilledTilesNumbers(rowGameTiles);

    const isRowComplete =
      gameRowGroupNumber.gameTilesNumbers.length === rowGameNumbers.length &&
      gameRowGroupNumber.gameTilesNumbers.every(
        (n, i) => n.number == rowGameNumbers[i],
      );

    if (isRowComplete) {
      for (let x = 0; x < this.board.width; x++) {
        const index = x + tileY * this.board.width;

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

  //   getXY(index: number): [number, number] {
  //     let x = index % this.game.width;
  //     let y = Math.floor(index / this.game.width);
  //     return [x, y];
  //   }

  private getRowTiles(allTiles: Tile[], y: number): Tile[] {
    return allTiles.slice(
      this.board.width * y,
      this.board.width * y + this.board.width,
    );
  }

  private getColumnTiles(allTiles: Tile[], x: number): Tile[] {
    const tiles: Tile[] = [];
    for (let y = 0; y < this.board.height; y++) {
      tiles.push(allTiles[this.board.width * y + x]);
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

  private getGameGroupNumber(
    groupNumber: number[],
    tiles: Tile[],
  ): GameGroupNumber {
    let gameGroupNumber: GameGroupNumber = {
      complete: false,
      gameTilesNumbers: groupNumber.map<GameTilesNumber>((n) => ({
        complete: false,
        number: n,
      })),
    };

    const checkCompleteNumbers = (inverse = false) => {
      let checkedNumbers: GameGroupNumber = { ...gameGroupNumber };
      let checkGameTiles: Tile[] = [...tiles];

      if (inverse) {
        checkedNumbers.gameTilesNumbers.reverse();
        checkGameTiles.reverse();
      }

      let filledNumbersIndex = 0;

      let baseCounter = 0;
      let counter = 0;

      checkGameTiles.forEach((t, i) => {
        if (filledNumbersIndex >= checkedNumbers.gameTilesNumbers.length)
          return;

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
          const number =
            checkedNumbers.gameTilesNumbers[filledNumbersIndex].number;
          if (number == counter) {
            checkedNumbers.gameTilesNumbers[filledNumbersIndex].complete = true;
            filledNumbersIndex++;
          }
          counter = 0;
        }
      });

      if (inverse) {
        checkedNumbers.gameTilesNumbers.reverse();
        checkGameTiles.reverse();
      }

      checkedNumbers.complete = checkedNumbers.gameTilesNumbers.every(
        (gameTilesNumber) => gameTilesNumber.complete,
      );

      return checkedNumbers;
    };

    gameGroupNumber = checkCompleteNumbers();

    if (tiles.includes(0)) {
      gameGroupNumber = checkCompleteNumbers(true);
    }

    return gameGroupNumber;
  }

  // private getCompletedTilesNumbers(
  //   filledTilesNumbers: number[],
  //   tiles: Tile[],
  // ): FilledTilesNumber[] {
  //   let numbers = filledTilesNumbers.map<FilledTilesNumber>((n) => ({
  //     number: n,
  //     complete: false,
  //   }));

  //   const checkCompleteNumbers = (inverse = false) => {
  //     let checkedNumbers: GameGroupNumber = JSON.parse(JSON.stringify(numbers));
  //     let checkGameTiles: Tile[] = JSON.parse(JSON.stringify(tiles));

  //     if (inverse) {
  //       checkedNumbers.reverse();
  //       checkGameTiles.reverse();
  //     }

  //     let filledNumbersIndex = 0;

  //     let baseCounter = 0;
  //     let counter = 0;

  //     checkGameTiles.forEach((t, i) => {
  //       if (filledNumbersIndex >= checkedNumbers.length) return;

  //       if (t == -1) baseCounter++;

  //       if (t == 1) {
  //         if (baseCounter === i) {
  //           counter++;
  //         }
  //         baseCounter++;
  //       }

  //       if (
  //         (t == 0 || t == -1 || i + 1 === checkGameTiles.length) &&
  //         counter > 0
  //       ) {
  //         const number = checkedNumbers[filledNumbersIndex].number;
  //         if (number == counter) {
  //           checkedNumbers[filledNumbersIndex].complete = true;
  //           filledNumbersIndex++;
  //         }
  //         counter = 0;
  //       }
  //     });

  //     if (inverse) {
  //       checkedNumbers.reverse();
  //       checkGameTiles.reverse();
  //     }

  //     return checkedNumbers;
  //   };

  //   numbers = checkCompleteNumbers();

  //   if (tiles.includes(0)) {
  //     numbers = checkCompleteNumbers(true);
  //   }

  //   return numbers;
  // }
}
