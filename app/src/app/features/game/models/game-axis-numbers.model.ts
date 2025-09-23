export interface GameTilesNumber {
  number: number;
  complete: boolean;
}

export interface GameGroupNumber {
  complete: boolean;
  gameTilesNumbers: GameTilesNumber[];
}

export type GameAxisNumbers = GameGroupNumber[]