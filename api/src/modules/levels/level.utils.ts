import { Board } from "../../interfaces/board";

export function isGameComplete(gameTiles: number[], board: Board): boolean {
  const isWin = gameTiles.every((gt, i) => {
    let gameTile = gt <= 0 ? 0 : 1;
    const isCorrect = gameTile === board.filledTiles[i];
    return isCorrect;
  });

  return isWin;
}

export function getProgressPercentage(
  gameTiles: number[],
  board: Board
): number {
  const gameTilesCount = gameTiles.reduce<number>(
    (count, num) => (num === 1 ? count + 1 : count),
    0
  );
  const progressRatio = parseFloat(
    (gameTilesCount / board.filledTilesCount).toFixed(2)
  );
  return progressRatio * 100;
}
