export interface Board {
  name: string;
  width: number;
  height: number;
  filledTiles: number[];
  coloredTiles: string[];
  level: number;
  filledTilesNumber: number;
  columnNumbers: number[][];
  rowNumbers: number[][];
}
