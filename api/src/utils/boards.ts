
export function getColumnNumbers(board: any): number[][] {
  const ftl: number[][] = [];
  for (let x = 0; x < board.width; x++) {
    const tiles: number[] = [];
    for (let y = 0; y < board.height; y++) {
      tiles.push(board.filledTiles[board.width * y + x]);
    }
    ftl.push(getFilledTilesNumbers(tiles));
  }
  return ftl;
}

export function getRowNumbers(board: any): number[][] {
  const ftl: number[][] = [];
  for (let y = 0; y < board.height; y++) {
    const tiles = board.filledTiles
      .slice(board.width * y, board.width * y + board.width);

    ftl.push(getFilledTilesNumbers(tiles));
  }
  return ftl;
}

function getFilledTilesNumbers(tiles: number[]) {
  const filledTilesNumbers = [];

  let counter = 0;

  tiles.forEach((tile, i, arr) => {
    if (tile == 1) {
      counter++;
    }
    if ((tile == 0 || tile == -1 || i + 1 === arr.length) && counter > 0) {
      filledTilesNumbers.push(counter);
      counter = 0;
    }
  });

  if (filledTilesNumbers.length == 0) filledTilesNumbers.push(0);

  return filledTilesNumbers;
}
