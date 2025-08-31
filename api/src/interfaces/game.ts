export interface Game {
  boardId: string;
  userId?: string;
  gameTiles: number[];
  history: any[];
}
