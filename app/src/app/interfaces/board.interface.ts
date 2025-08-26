export interface Board {
  _id?: string| null;
  id?: string | null;
  name: string;
  width: number;
  height: number;
  filledTiles: number[];
  coloredTiles: string[];
  innerColumn: number;
  innerRow: number;
  filledTilesNumber: number;
  columnNumbers: number[][];
  rowNumbers: number[][];
  level: number;
  order: number;
  subGrid: number;
}

export const voidBoard = (): Board => ({
  name: '',
  width: 0,
  height: 0,
  filledTiles: [],
  coloredTiles: [],
  innerColumn: 0,
  innerRow: 0,
  filledTilesNumber: 0,
  columnNumbers: [],
  rowNumbers: [],
  level: 0,
  order: 0,
  subGrid: 0
});
