
let filledTiles = [];
let coloredTiles = [];
let gameTiles = [];

let gridSizeX;
let gridSizeY;

filledTiles = [
  0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0,
];

coloredTiles = [
  "#2cd3ad",
  "#f27070",
  "#2cd3ad",
  "#f21414",
  "#2cd3ad",
  "#f27070",
  "#ffffff",
  "#f21414",
  "#f21414",
  "#f21414",
  "#f21414",
  "#f21414",
  "#f21414",
  "#f21414",
  "#f21414",
  "#2cd3ad",
  "#f21414",
  "#f21414",
  "#ab0e0e",
  "#2cd3ad",
  "#2cd3ad",
  "#2cd3ad",
  "#ab0e0e",
  "#2cd3ad",
  "#2cd3ad",
];

gridSizeX = 5;
gridSizeY = 5;

gameTiles = Array.from({ length: gridSizeX * gridSizeY }).fill(0);

const counterEl = document.querySelector("[data-filled-tiles-counter]");
const columnNumbersContainerEl = document.querySelector(
  "[data-column-numbers]"
);
const rowNumbersContainerEl = document.querySelector("[data-row-numbers]");
const gridTileEl = document.querySelector("[data-grid-tile]");

// const inputImg = document.querySelector("[data-input-img-fill]");

// inputImg.addEventListener("input", (e) => {
//   const files = e.target.files;

//   const filteredFiles = [...files].filter(
//     (f) => f.name.match("_fill.") || f.name.match("_color.")
//   );

//   filteredFiles.forEach((file) => {
//     const fileName = file.name;

//     const reader = new FileReader();
//     reader.addEventListener("loadend", (ev) => {
//       const result = ev.target.result;

//       const img = new Image();

//       img.onload = () => {
//         const ctx = document.createElement("canvas").getContext("2d");
//         ctx.drawImage(img, 0, 0);

//         const imgData = ctx.getImageData(0, 0, img.width, img.height);
//         const pixels = imgData.data;

//         gridSizeX = img.width;
//         gridSizeY = img.height;

//         gameTiles = Array.from({ length: gridSizeX * gridSizeY }).fill(0);

//         if (fileName.match("_fill.")) filledTiles = [];
//         else if (fileName.match("_color.")) coloredTiles = [];

//         for (let i = 0; i < pixels.length; i += 4) {
//           const r = pixels[i];
//           const g = pixels[i + 1];
//           const b = pixels[i + 2];

//           const hex = rgbToHex(r, g, b);

//           if (fileName.match("_fill.")) {
//             if (hex == "#000000") filledTiles.push(1);
//             else filledTiles.push(0);
//           } else if (fileName.match("_color.")) {
//             coloredTiles.push(hex);
//           }
//         }

//         render();
//       };

//       img.src = result;
//     });

//     reader.readAsDataURL(file);
//   });
// });

render();

gridTileEl.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target == gridTileEl) return;
  clickTile(e.target, true);
});

gridTileEl.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (e.target == gridTileEl) return;
  clickTile(e.target, false);
});

gridTileEl.addEventListener("mousedown", (e) => {
  e.preventDefault();
  console.log(e);
});

function clickTile(tileEl, fill = true) {
  const index = Number(tileEl.getAttribute("data-index"));

  if (getTilesCounter(gameTiles) >= getTilesCounter(filledTiles) && fill) {
    alert("No puedes agregar mas cuadros");
    return;
  }

  if (gameTiles[index] == 1 && fill) gameTiles[index] = 0;
  else if (gameTiles[index] == -1 && !fill) gameTiles[index] = 0;
  else gameTiles[index] = fill ? 1 : -1;

  // auto completar
  let x = Number(tileEl.getAttribute("data-x"));
  let y = Number(tileEl.getAttribute("data-y"));

  getColumnTiles(gameTiles, gridSizeX, gridSizeY, x);

  render();
  if (checkGameWin()) {
    render(true);

    setTimeout(() => {
      alert("Ganaste");
    }, 5);
  } else if (getTilesCounter(gameTiles) == getTilesCounter(filledTiles)) {
    setTimeout(() => {
      alert("Tienes casillas incorrectas");
    }, 5);
  }
}

function checkGameWin() {
  return gameTiles.every((gt, i) => {
    let gameTile = gt <= 0 ? 0 : 1;
    return gameTile == filledTiles[i];
  });
}

function render(colored = false) {
  if (filledTiles.length == 0 || coloredTiles.length == 0) return;

  renderCounter(counterEl, gameTiles, filledTiles);
  renderGrid(gridTileEl, gameTiles, coloredTiles, colored);
  renderRowNumbers(
    rowNumbersContainerEl,
    filledTiles,
    gameTiles,
    gridSizeX,
    gridSizeY
  );
  renderColumnNumbers(
    columnNumbersContainerEl,
    filledTiles,
    gameTiles,
    gridSizeX,
    gridSizeY
  );
}

function renderCounter(counterEl, gameTiles, filledTiles) {
  let filledGameTilesNumber = getTilesCounter(gameTiles);
  let filledTilesNumber = getTilesCounter(filledTiles);

  counterEl.innerText = `${filledGameTilesNumber} / ${filledTilesNumber}`;
}

function renderGrid(gridTileEl, tiles, coloredTiles = [], colored = false) {
  const tileEls = tiles.map((t, i) => {
    const tileEl = document.createElement("div");

    tileEl.setAttribute("data-index", i);
    tileEl.setAttribute("data-x", i % gridSizeX);
    tileEl.setAttribute("data-y", Math.floor(i / gridSizeX));

    tileEl.classList.add("tile");
    if (!colored) {
      if (t === 1) tileEl.classList.add("filled");
      if (t === -1) tileEl.classList.add("cross");
    } else {
      tileEl.classList.remove("filled");
      tileEl.classList.remove("cross");
      tileEl.style.border = "none";
      tileEl.style.backgroundColor = coloredTiles[i];
    }
    return tileEl;
  });

  gridTileEl.style.gridTemplateRows = `repeat(${gridSizeY}, 1fr)`;
  gridTileEl.style.gridTemplateColumns = `repeat(${gridSizeX}, 1fr)`;

  gridTileEl.innerHTML = tileEls
    .map((t) => t.outerHTML)
    .toString()
    .replaceAll(",", " ");
}

function renderRowNumbers(
  rowNumbersContainerEl,
  filledTiles,
  gameTiles,
  gridSizeX,
  gridSizeY
) {
  const rowNumbers = getRowNumbers(filledTiles, gridSizeX, gridSizeY);

  rowNumbersContainerEl.innerHTML = "";
  rowNumbersContainerEl.style.gridTemplateRows = `repeat(${gridSizeX}, 1fr)`;

  rowNumbers.forEach((rn, y) => {
    const rnEl = document.createElement("div");
    rnEl.classList.add("group-numbers");

    const rowGameTiles = getRowTiles(gameTiles, gridSizeX, y);
    const gameTileNumbers = getFilledTilesNumbers(rowGameTiles);
    const completedNumbers = getCompletedTilesNumbers(rn, rowGameTiles);

    const isComplete =
      rn.length === gameTileNumbers.length &&
      rn.every((n, i) => n == gameTileNumbers[i]);

    if (isComplete) {
      rnEl.classList.add("complete");
    }

    completedNumbers.forEach((n) => {
      rnEl.innerHTML += `<div class="number ${
        n.isComplete ? "complete" : ""
      }">${n.number}</div>`;
    });

    rowNumbersContainerEl.innerHTML += rnEl.outerHTML;
  });
}

function renderColumnNumbers(
  columnNumbersContainerEl,
  filledTiles,
  gameTiles,
  gridSizeX,
  gridSizeY
) {
  const columnNumbers = getColumnNumbers(filledTiles, gridSizeX, gridSizeY);

  columnNumbersContainerEl.innerHTML = "";
  columnNumbersContainerEl.style.gridTemplateColumns = `repeat(${gridSizeX}, 1fr)`;
  columnNumbers.forEach((cn, x) => {
    const cnEl = document.createElement("div");
    cnEl.classList.add("group-numbers");

    const columnGameTiles = getColumnTiles(gameTiles, gridSizeX, gridSizeY, x);
    const gameTileNumbers = getFilledTilesNumbers(columnGameTiles);
    const completedNumbers = getCompletedTilesNumbers(cn, columnGameTiles);

    const isComplete =
      cn.length === gameTileNumbers.length &&
      cn.every((n, i) => n == gameTileNumbers[i]);

    if (isComplete) {
      cnEl.classList.add("complete");
    }

    completedNumbers.forEach((n) => {
      cnEl.innerHTML += `<div class="number ${
        n.isComplete ? "complete" : ""
      }">${n.number}</div>`;
    });

    columnNumbersContainerEl.innerHTML += cnEl.outerHTML;
  });
}

function getRowNumbers(filledTiles = [], gridSizeX = 0, gridSizeY = 0) {
  const rowNumbers = [];
  for (let y = 0; y < gridSizeY; y++) {
    const tiles = getRowTiles(filledTiles, gridSizeX, y);

    const filledTilesNumbers = getFilledTilesNumbers(tiles);

    rowNumbers.push(filledTilesNumbers);
  }
  return rowNumbers;
}

function getColumnNumbers(filledTiles = [], gridSizeX = 0, gridSizeY = 0) {
  const columnNumbers = [];
  for (let x = 0; x < gridSizeX; x++) {
    const tiles = getColumnTiles(filledTiles, gridSizeX, gridSizeY, x);

    const filledTilesNumbers = getFilledTilesNumbers(tiles);

    columnNumbers.push(filledTilesNumbers);
  }
  return columnNumbers;
}

function getRowTiles(allTiles, gridSizeX, y) {
  return allTiles.slice(gridSizeX * y, gridSizeX * y + gridSizeX);
}

function getColumnTiles(allTiles, gridSizeX, gridSizeY, x) {
  const tiles = [];
  for (let y = 0; y < gridSizeY; y++) {
    tiles.push(allTiles[gridSizeX * y + x]);
  }
  return tiles;
}

function getFilledTilesNumbers(tiles) {
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

function getCompletedTilesNumbers(filledNumbers = [], gameTiles = []) {
  let numbers = [
    {
      number: 1,
      isComplete: false,
    },
  ];

  numbers = filledNumbers.map((n) => ({ number: n, isComplete: false }));

  const checkCompleteNumbers = (numbers, gameTiles, inverse = false) => {
    let checkedNumbers = JSON.parse(JSON.stringify(numbers));
    let checkGameTiles = JSON.parse(JSON.stringify(gameTiles));

    if (inverse) {
      checkedNumbers.reverse();
      checkGameTiles.reverse();
    }

    let filledNumbersIndex = 0;

    let baseCounter = 0;
    let counter = 0;
    checkGameTiles.forEach((t, i) => {
      if (t == -1) baseCounter++;

      if (t == 1) {
        if (baseCounter === i) {
          counter++;
        }
        baseCounter++;
      }

      if (
        (t == 0 || t == -1 || i + 1 === checkGameTiles.length) &&
        counter > 0
      ) {
        const number = checkedNumbers[filledNumbersIndex].number;
        if (number == counter) {
          checkedNumbers[filledNumbersIndex].isComplete = true;
          filledNumbersIndex++;
          counter = 0;
        }
      }
    });

    if (inverse) {
      checkedNumbers.reverse();
      checkGameTiles.reverse();
    }

    return checkedNumbers;
  };

  numbers = checkCompleteNumbers(numbers, gameTiles);

  if (gameTiles.includes(0)) {
    numbers = checkCompleteNumbers(numbers, gameTiles, true);
  }

  return numbers;
}

function getTilesCounter(tiles) {
  return [...tiles].reduce((prev, curr, i) => {
    if (i == 1 && prev == -1) return curr;
    return curr == -1 ? prev : prev + curr;
  });
}

function rgbToHex(r, g, b) {
  const toDigit = (string) => (string.length === 1 ? "0" + string : string);

  return (
    "#" +
    toDigit(r.toString(16)) +
    toDigit(g.toString(16)) +
    toDigit(b.toString(16))
  );
}
