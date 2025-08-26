export interface Level {
  id: string,
  order: number;
  complete: boolean;
  progressPorcentage: number;
  coloredTiles: string[]
  width: number;
  height: number;
}
