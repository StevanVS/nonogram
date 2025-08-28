export type Tile = -1 | 0 | 1;

export interface GameHistory {
  previous: Tile;
  indexes: number[];
  autoCompletedIdxs: number[];
}

export interface Game {
  id: string;
  gameTiles: Tile[];
  history: GameHistory[];
}

export function voidGame(): Game {
  return {
    id: '',
    gameTiles: [],
    history: [],
  };
}
