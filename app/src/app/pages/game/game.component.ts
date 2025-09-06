import {
  Component,
  computed,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  GameAxisNumbers,
  GameTilesNumber,
  GameGroupNumber,
} from '../../interfaces/game-axis-numbers';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game, Tile, voidGame } from '../../interfaces/game.interface';
import { LocalStorageService } from '../../services/local-storage.service';
import { Board, voidBoard } from '../../interfaces/board.interface';
import { NgClass, UpperCasePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ImgBoardComponent } from '../../components/img-board/img-board.component';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  imports: [NgClass, ImgBoardComponent, UpperCasePipe, RouterLink],
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
  private autoSaveSubscription!: Subscription;

  borderClasses: { [key: number]: { [klass: string]: any } } = {};

  board: Board = voidBoard();

  game: Game = voidGame();

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

  get isGameWin(): boolean {
    return this.board.coloredTiles.length > 0;
  }

  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private localStorageService = inject(LocalStorageService);

  constructor() {
    this.initAutosave();
  }

  ngOnInit() {
    let boardId: string = this.activatedRoute.snapshot.params['id'];
    this.authService.isUserAuthenticated().subscribe({
      next: (isAuth) => {
        let games: Game[] = [];
        if (!isAuth) {
          games = this.localStorageService.getItem<Game[]>('games') || [];
        }

        const game = games.find((g) => g.boardId === boardId);
        // console.log('game', game);
        this.getGame(boardId, game);
      },
      error: console.error,
    });
  }

  ngOnDestroy() {
    console.log('destroy');
    this.disableAutosave();
    this.saveProgress(() => {
      console.log('Saved');
    });
  }

  initAutosave() {
    console.log('init autosave');
    this.autoSaveSubscription = interval(20000).subscribe({
      next: () => {
        this.saveProgress(() => {
          console.log('autosave');
        });
      },
    });
  }

  disableAutosave() {
    this.autoSaveSubscription.unsubscribe();
  }

  getGame(boardId: string, game?: Game | null) {
    this.gameService.getGame(boardId, game).subscribe({
      next: (res) => {
        this.board = res.datos.board;
        this.game = res.datos.game;

        this.gameTiles.set(this.game.gameTiles);

        Array.from({ length: this.board.width * this.board.height }).map(
          (_, index) => {
            const x = index % this.board.width;
            const y = Math.floor(index / this.board.width);
            const width = this.board.width;
            const height = this.board.height;
            const subGrid = this.board.subGrid;
            this.borderClasses[index] = {
              'border-t': y >= 1,
              'border-b': y < height - 1,
              'border-l': x >= 1,
              'border-r': x < width - 1,

              'border-t-2': index >= width && y % subGrid === 0,
              'border-b-2':
                index < width * (height - 1) && y % subGrid === subGrid - 1,
              'border-r-2': x !== width - 1 && x % subGrid === subGrid - 1,
              'border-l-2': x !== 0 && x % subGrid === 0,
            };
          },
        );
      },
      error: console.error,
    });
  }

  private saveProgress(callback: Function) {
    if (this.isGameWin) return;

    // Si no hay cambio no guardar
    if (
      JSON.stringify(this.game.gameTiles) === JSON.stringify(this.gameTiles())
    )
      return;

    const isAuth = this.authService.authState$.value;

    if (isAuth) {
      this.gameService.saveGame(this.getCurrentGame()).subscribe({
        next: () => callback(),
        error: console.error,
      });
    } else {
      let storedGames = this.localStorageService.getItem<Game[]>('games');
      if (storedGames == null) storedGames = [];

      const index = storedGames.findIndex((g) => g.boardId === this.board.id);
      index === -1
        ? storedGames.push(this.getCurrentGame())
        : (storedGames[index] = this.getCurrentGame());

      this.localStorageService.setItem('games', storedGames);
      callback();
    }
  }

  private getCurrentGame(): Game {
    this.game.gameTiles = this.gameTiles();
    return { ...this.game };
  }

  checkGameWin() {
    if (this.gameFilledTilesCounter() !== this.board.filledTilesCount) {
      return;
    }

    this.disableAutosave();
    this.saveProgress(() => {
      this.gameService.getGame(this.game.boardId, this.game).subscribe({
        next: (res) => {
          console.log('check win', res.datos);
          this.board = res.datos.board;

          // TODO: mensaje con modal
          if (!this.isGameWin) {
            alert('Solution Not Found');
            this.initAutosave();
            return;
          }
        },
        error: console.error,
      });
    });
  }

  onReset() {
    this.gameService.getNewGame(this.game.boardId).subscribe({
      next: (res) => {
        this.board = res.datos.board;
        this.game = res.datos.game;

        this.gameTiles.set(this.game.gameTiles);
      },
      error: console.error,
    });
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

    // this.saveProgress();
    this.checkGameWin();

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

    // this.saveProgress();
    this.checkGameWin();
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
}
