export interface Board {
  _id: string;
  name: string;
  width: number;
  height: number;
  filledTiles: number[];
  coloredTiles: string[];
  order: number;
}

export const voidBoard = (): Board => ({
  _id: '',
  name: '',
  width: 0,
  height: 0,
  filledTiles: [],
  coloredTiles: [],
  order: 0,
});
