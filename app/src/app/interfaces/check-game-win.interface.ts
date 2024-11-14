export interface CheckGameWin {
  isWin: boolean;
  boardId: string;
  coloredTiles: string[];
  name: string;
}

export function voidCheckGameWin(): CheckGameWin {
  return {
    isWin: false,
    boardId: '',
    coloredTiles: [],
    name: '',
  }
}
