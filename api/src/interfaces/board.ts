export interface Board {
  id?: string | null;
  name: string;
  width: number;
  height: number;
  filledTiles: number[];
  coloredTiles: string[];
  filledTilesCount: number;
  columnNumbers: number[][];
  rowNumbers: number[][];
  order: number;
  subGrid: number;
}