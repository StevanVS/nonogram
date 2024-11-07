import { Tile } from "./tile.interface";

export interface GameHistory {
  previous: Tile;
  indexes: number[];
  autoCompletedIdxs: number[];
}
