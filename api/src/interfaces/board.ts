export interface Board {
  _id: string;
  name: string;
  width: number;
  height: number;
  filledTiles: number[];
  coloredTiles: string[];
  level: number;
}
