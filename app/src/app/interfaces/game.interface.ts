import { GameHistory } from "./gameHistory.interface";
import { Tile } from "./tile.interface";

export interface Game {
  gameTiles: Tile[];
  history: GameHistory[];
  filledTilesNumber: number;
  columnNumbers: number[][];
  rowNumbers: number[][];
  width: number;
  height: number;
  innerColumn: number;
  innerRow: number;
  level: number;
}

export function voidGame(): Game {
  return {
    gameTiles: [],
    history: [],
    filledTilesNumber: 0,
    columnNumbers: [],
    rowNumbers: [],
    width: 0,
    height: 0,
    innerColumn: 0,
    innerRow: 0,
    level: 0,
  }
}
