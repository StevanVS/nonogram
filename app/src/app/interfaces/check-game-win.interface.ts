export interface CheckGameWin {
  isWin: boolean;
  coloredTiles?: string[];
  name?: string;
}

export function voidCheckGameWin(): CheckGameWin {
  return {
    isWin: false,
  }
}
