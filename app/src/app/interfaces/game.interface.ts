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
}

