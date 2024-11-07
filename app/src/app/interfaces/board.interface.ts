export interface Board {
  _id: string;
  name: string;
  width: number;
  height: number;
  filledTiles: number[];
  coloredTiles: string[];
  level: number;
}

export const voidBoard = (): Board => ({
  _id: '',
  name: '',
  width: 0,
  height: 0,
  filledTiles: [],
  coloredTiles: [],
  level: 0,
});
