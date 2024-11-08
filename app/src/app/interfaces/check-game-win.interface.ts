export interface CheckGameWin {
  isWin: boolean;
  coloredTiles: string[];
  nextBoardId: string;
}

export function voidCheckGameWin(): CheckGameWin {
  return {
    isWin: false,
    coloredTiles: [],
    nextBoardId: ''
  }
}
