export interface Level {
  id: string,
  order: number;
  // complete: boolean;
  progressPercentage: number;
  coloredTiles: string[]
  width: number;
  height: number;
}
