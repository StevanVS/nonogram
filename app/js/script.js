import Game from "./Game.js";
import ImageReader from "./ImageReader.js";

let filledTiles = [];
let coloredTiles = [];

let width = 0;
let height = 0;

const gameEl = document.querySelector("[data-game]");
const gameboardEl = document.querySelector("[data-game-board]");
const counterEl = document.querySelector("[data-filled-tiles-counter]");
const historyBackBtnEl = document.querySelector("[data-history-back]");
const gridTileEl = document.querySelector("[data-grid-tile]");
const columnNumbersEl = document.querySelector("[data-column-numbers]");
const rowNumbersEl = document.querySelector("[data-row-numbers]");

const game = new Game(
  filledTiles,
  coloredTiles,
  width,
  height,
  gameEl,
  gameboardEl,
  counterEl,
  historyBackBtnEl,
  gridTileEl,
  columnNumbersEl,
  rowNumbersEl
);

const inputImgEl = document.querySelector("[data-input-img]");
const inputImgFieldEl = document.querySelector("[data-input-img-field]");

const errorMsgEl = document.querySelector("[data-error-msg]");

const imageReader = new ImageReader(inputImgEl, inputImgFieldEl);

// imageReader
//   .onFileChange()
//   .then(() => {
//     game.setTiles(
//       imageReader.filledTiles,
//       imageReader.coloredTiles,
//       imageReader.width,
//       imageReader.height
//     );
//     game.init();
//   })
//   .catch((err) => {
//     errorMsgEl.innerText = err;
//     errorMsgEl.style.display = "block";
//   });

async function fetchBoard(id) {
  const res = await fetch(`http://localhost:3050/boards/${id}`).then((r) =>
    r.json()
  );

  if (!res.ok) {
    errorMsgEl.innerText = res.error;
    errorMsgEl.style.display = "block";
    return;
  }
  const board = res.datos;

  filledTiles = board.filledTiles;
  coloredTiles = board.coloredTiles;
  width = board.width;
  height = board.height;

  game.setTiles(filledTiles, coloredTiles, width, height);
  game.init();
}

fetchBoard("67117c655a3f3328edfe6911");
inputImgFieldEl.style.display = "none";