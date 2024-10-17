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

imageReader
  .onFileChange()
  .then(() => {
    game.setTiles(
      imageReader.filledTiles,
      imageReader.coloredTiles,
      imageReader.width,
      imageReader.height
    );
    game.init();
  })
  .catch((err) => {
    errorMsgEl.innerText = err;
    errorMsgEl.style.display = 'block'
  });

// inputImgFieldEl.style.display = "none";

// filledTiles = [
//   0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0,
// ];

// coloredTiles = [
//   "#2cd3ad",
//   "#f27070",
//   "#2cd3ad",
//   "#f21414",
//   "#2cd3ad",
//   "#f27070",
//   "#ffffff",
//   "#f21414",
//   "#f21414",
//   "#f21414",
//   "#f21414",
//   "#f21414",
//   "#f21414",
//   "#f21414",
//   "#f21414",
//   "#2cd3ad",
//   "#f21414",
//   "#f21414",
//   "#ab0e0e",
//   "#2cd3ad",
//   "#2cd3ad",
//   "#2cd3ad",
//   "#ab0e0e",
//   "#2cd3ad",
//   "#2cd3ad",
// ];

// width = 5;
// height = 5;

// game.setTiles(filledTiles, coloredTiles, width, height);
// game.init();
