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

export const voidBoard = (): Board => ({
  name: '',
  width: 0,
  height: 0,
  filledTiles: [],
  coloredTiles: [],
  filledTilesCount: 0,
  columnNumbers: [],
  rowNumbers: [],
  subGrid: 0,
  order: 0,
});
