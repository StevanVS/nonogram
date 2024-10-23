export interface Board {
  _id?: string;
  // id?: string;
  order?: number;
  name?: string;
  width?: number;
  height?: number;
  filledTiles?: number[];
  coloredTiles?: string[];
  filledImage?: string;
  coloredImage?: string;
}
