export default class Game {
  filledTiles = [];
  coloredTiles = [];
  gameTiles = [];

  width = 0;
  height = 0;

  gameEl = document.createElement("div");
  gameBoardEl = document.createElement("div");
  counterEl = document.createElement("div");
  historyBackBtnEl = document.createElement("div");
  columnNumbersEl = document.createElement("div");
  rowNumbersEl = document.createElement("div");
  gridTileEl = document.createElement("div");

  #history = [];

  isWin = false;

  #isMouseDown = false;
  #currentTileIndex = 0;
  #initDragTile = 0;
  #initDragTileX = 0;
  #initDragTileY = 0;
  #isDragAxisX = null;

  constructor(
    filledTiles,
    coloredTiles,
    width,
    height,
    gameEl,
    gameBoardEl,
    counterEl,
    historyBackBtnEl,
    gridTileEl,
    columnNumbersEl,
    rowNumbersEl
  ) {
    this.filledTiles = filledTiles;
    this.coloredTiles = coloredTiles;
    this.width = width;
    this.height = height;

    this.gameEl = gameEl;
    this.gameBoardEl = gameBoardEl;
    this.counterEl = counterEl;
    this.historyBackBtnEl = historyBackBtnEl;
    this.gridTileEl = gridTileEl;
    this.columnNumbersEl = columnNumbersEl;
    this.rowNumbersEl = rowNumbersEl;
  }

  setTiles(filledTiles, coloredTiles, width, height) {
    this.filledTiles = filledTiles;
    this.coloredTiles = coloredTiles;
    this.width = width;
    this.height = height;
  }

  init() {
    this.gameEl.style.display = "flex";
    this.gameTiles = Array.from({ length: this.width * this.height }).fill(0);
    this.#history.push([...this.gameTiles]);
    this.#addEvents();
    this.render();
  }

  update() {
    this.isWin = this.#checkGameWin();
    if (this.isWin) this.#disableEvents();

    this.render();
  }

  render() {
    if (this.filledTiles.length == 0 || this.coloredTiles.length == 0) return;
    if (this.isWin) {
      this.gameBoardEl.style.display = "block";
      this.#renderCounter(true);
      this.#renderHistoryBackBtn(true);
      this.#renderGrid(true);
      this.#renderRowNumbers(true);
      this.#renderColumnNumbers(true);
    } else {
      this.gameBoardEl.style.display = "grid";
      this.#renderCounter();
      this.#renderHistoryBackBtn();
      this.#renderGrid();
      this.#renderRowNumbers();
      this.#renderColumnNumbers();
    }
  }

  #checkGameWin() {
    return this.gameTiles.every((gt, i) => {
      let gameTile = gt <= 0 ? 0 : 1;
      return gameTile == this.filledTiles[i];
    });
  }

  #addEvents() {
    this.gridTileEl.oncontextmenu = (e) => e.preventDefault();
    this.gridTileEl.onmouseup = (e) => {
      const isDiff = this.#history[this.#history.length - 1].some(
        (h, i) => h != this.gameTiles[i]
      );

      if (isDiff) this.#history.push([...this.gameTiles]);

      this.#isMouseDown = false;
      this.#currentTileIndex = 0;
      this.#initDragTile = 0;
      this.#initDragTileX = 0;
      this.#initDragTileY = 0;
      this.#isDragAxisX = null;

      this.render();
    };

    // click
    this.gridTileEl.onmousedown = (e) => {
      e.preventDefault();
      if (e.target === this.gridTileEl) return;

      this.#isMouseDown = true;
      this.#currentTileIndex = this.#getTileIndex(e.target);
      this.#initDragTile = this.gameTiles[this.#currentTileIndex];
      this.#initDragTileX = this.#getTileX(e.target);
      this.#initDragTileY = this.#getTileY(e.target);

      if (e.button === 0) this.#click(e.target, true);
      if (e.button === 2) this.#click(e.target, false);
    };

    // drag
    this.gridTileEl.onmousemove = (e) => {
      if (!this.#isMouseDown) return;
      if (e.target === this.gridTileEl) return;

      const currentIndex = this.#getTileIndex(e.target);
      if (this.#currentTileIndex === currentIndex) return;

      // lock axis
      let x = this.#getTileX(e.target);
      let y = this.#getTileY(e.target);

      if (x != this.#initDragTileX && this.#isDragAxisX == null)
        this.#isDragAxisX = true;
      else if (y != this.#initDragTileY && this.#isDragAxisX == null)
        this.#isDragAxisX = false;

      let tileEl;
      if (this.#isDragAxisX) {
        tileEl = this.#getGameTileEl(x, this.#initDragTileY);
      } else {
        tileEl = this.#getGameTileEl(this.#initDragTileX, y);
      }

      if (e.buttons === 1) this.#drag(tileEl, true);
      if (e.buttons === 2) this.#drag(tileEl, false);

      this.#currentTileIndex = currentIndex;
    };

    this.historyBackBtnEl.onclick = (e) => {
      this.#history.pop();
      this.gameTiles = [...this.#history[this.#history.length - 1]];
      this.update();
    };
  }

  #disableEvents() {
    this.gridTileEl.oncontextmenu = (e) => null;
    this.gridTileEl.onmouseup = (e) => null;
    this.gridTileEl.onmousedown = (e) => null;
    this.gridTileEl.onmousemove = (e) => null;
  }

  #click(tileEl, fill = true) {
    const index = this.#getTileIndex(tileEl);

    if (this.gameTiles[index] == 1 && fill) this.gameTiles[index] = 0;
    else if (this.gameTiles[index] == -1 && !fill) this.gameTiles[index] = 0;
    else this.gameTiles[index] = fill ? 1 : -1;

    if (fill) this.#autoComplete(tileEl);
    this.update();
  }

  #drag(tileEl, fill = true) {
    const index = this.#getTileIndex(tileEl);

    if (this.#initDragTile == 1 && this.gameTiles[index] == 1) {
      this.gameTiles[index] = fill ? 0 : -1;
    } else if (this.#initDragTile == -1 && this.gameTiles[index] == -1) {
      this.gameTiles[index] = fill ? 1 : 0;
    } else if (
      this.#initDragTile == 0 &&
      this.#initDragTile == this.gameTiles[index]
    ) {
      this.gameTiles[index] = fill ? 1 : -1;
    }

    if (fill) this.#autoComplete(tileEl);
    this.update();
  }

  #autoComplete(tileEl) {
    let tileX = this.#getTileX(tileEl);
    let tileY = this.#getTileY(tileEl);

    const columnFilledTiles = this.#getColumnTiles(this.filledTiles, tileX);
    const columnFilledNumbers = this.#getFilledTilesNumbers(columnFilledTiles);

    const columnGameTiles = this.#getColumnTiles(this.gameTiles, tileX);
    const columnGameNumbers = this.#getFilledTilesNumbers(columnGameTiles);

    const isColumnComplete =
      columnFilledNumbers.length === columnGameNumbers.length &&
      columnFilledNumbers.every((n, i) => n == columnGameNumbers[i]);

    if (isColumnComplete) {
      for (let y = 0; y < this.height; y++) {
        const index = tileX + y * this.width;

        if (this.gameTiles[index] == 0) this.gameTiles[index] = -1;
      }
    }

    const rowFilledTiles = this.#getRowTiles(this.filledTiles, tileY);
    const rowFilledNumbers = this.#getFilledTilesNumbers(rowFilledTiles);

    const rowGameTiles = this.#getRowTiles(this.gameTiles, tileY);
    const rowGameNumbers = this.#getFilledTilesNumbers(rowGameTiles);

    const isRowComplete =
      rowFilledNumbers.length === rowGameNumbers.length &&
      rowFilledNumbers.every((n, i) => n == rowGameNumbers[i]);

    if (isRowComplete) {
      for (let x = 0; x < this.width; x++) {
        const index = x + tileY * this.width;

        if (this.gameTiles[index] == 0) this.gameTiles[index] = -1;
      }
    }
  }

  #renderCounter(hide = false) {
    if (hide) {
      this.counterEl.style.display = "none";
      return;
    }

    let filledGameTilesNumber = this.#getTilesCounter(this.gameTiles);
    let filledTilesNumber = this.#getTilesCounter(this.filledTiles);

    const counterTextEl = document.createElement("span");
    counterTextEl.classList.add("counter");
    counterTextEl.innerText = `${filledGameTilesNumber} / ${filledTilesNumber}`;

    this.counterEl.innerHTML = `
      <svg class="tile-icon" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <rect width="16" height="16" />
      </svg>
      ${counterTextEl.outerHTML}
    `;
  }

  #renderHistoryBackBtn(hide = false) {
    if (hide) {
      this.#hideEl(this.historyBackBtnEl);
      return;
    }

    if (this.#history.length <= 1) this.#hideEl(this.historyBackBtnEl);
    else this.#showEl(this.historyBackBtnEl);
  }

  #renderGrid(colored = false) {
    const tileEls = this.gameTiles.map((t, i) => {
      const tileEl = document.createElement("div");

      tileEl.setAttribute("data-index", i);
      tileEl.setAttribute("data-x", i % this.width);
      tileEl.setAttribute("data-y", Math.floor(i / this.width));

      tileEl.classList.add("tile");
      if (!colored) {
        if (t === 1) tileEl.classList.add("filled");
        if (t === -1) tileEl.classList.add("cross");
      } else {
        tileEl.classList.remove("filled");
        tileEl.classList.remove("cross");
        tileEl.style.border = "none";
        tileEl.style.backgroundColor = this.coloredTiles[i];
      }
      return tileEl;
    });

    this.gridTileEl.style.gridTemplateRows = `repeat(${this.height}, 1fr)`;
    this.gridTileEl.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;

    this.gridTileEl.innerHTML = "";
    tileEls.forEach((tileEl) => this.gridTileEl.appendChild(tileEl));
    // this.gridTileEl.innerHTML = tileEls
    //   .map((t) => t.outerHTML)
    //   .toString()
    //   .replaceAll(",", " ");
  }

  #renderRowNumbers(hide = false) {
    if (hide) {
      this.rowNumbersEl.style.display = "none";
      return;
    }

    const rowNumbers = [];
    for (let y = 0; y < this.width; y++) {
      const tiles = this.#getRowTiles(this.filledTiles, y);
      const filledTilesNumbers = this.#getFilledTilesNumbers(tiles);

      rowNumbers.push(filledTilesNumbers);
    }

    this.rowNumbersEl.innerHTML = "";
    this.rowNumbersEl.style.gridTemplateRows = `repeat(${this.width}, 1fr)`;

    rowNumbers.forEach((rn, y) => {
      const rnEl = document.createElement("div");
      rnEl.classList.add("group-numbers");

      const rowGameTiles = this.#getRowTiles(this.gameTiles, y);
      const gameTileNumbers = this.#getFilledTilesNumbers(rowGameTiles);
      const completedNumbers = this.#getCompletedTilesNumbers(rn, rowGameTiles);

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

      this.rowNumbersEl.innerHTML += rnEl.outerHTML;
    });
  }

  #renderColumnNumbers(hide = false) {
    if (hide) {
      this.columnNumbersEl.style.display = "none";
      return;
    }

    const columnNumbers = [];
    for (let x = 0; x < this.width; x++) {
      const tiles = this.#getColumnTiles(this.filledTiles, x);
      const filledTilesNumbers = this.#getFilledTilesNumbers(tiles);
      columnNumbers.push(filledTilesNumbers);
    }

    this.columnNumbersEl.innerHTML = "";
    this.columnNumbersEl.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;

    columnNumbers.forEach((cn, x) => {
      const cnEl = document.createElement("div");
      cnEl.classList.add("group-numbers");

      const columnGameTiles = this.#getColumnTiles(this.gameTiles, x);
      const gameTileNumbers = this.#getFilledTilesNumbers(columnGameTiles);
      const completedNumbers = this.#getCompletedTilesNumbers(
        cn,
        columnGameTiles
      );

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

      this.columnNumbersEl.innerHTML += cnEl.outerHTML;
    });
  }

  #getRowTiles(allTiles = [0], y = 0) {
    return allTiles.slice(this.width * y, this.width * y + this.width);
  }

  #getColumnTiles(allTiles = [0], x = 0) {
    const tiles = [];
    for (let y = 0; y < this.height; y++) {
      tiles.push(allTiles[this.width * y + x]);
    }
    return tiles;
  }

  #getFilledTilesNumbers(tiles = [0]) {
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

  #getCompletedTilesNumbers(filledTilesNumbers = [0], tiles = [0]) {
    let numbers = filledTilesNumbers.map((n) => ({
      number: n,
      isComplete: false,
    }));

    const checkCompleteNumbers = (inverse = false) => {
      let checkedNumbers = JSON.parse(JSON.stringify(numbers));
      let checkGameTiles = JSON.parse(JSON.stringify(tiles));

      if (inverse) {
        checkedNumbers.reverse();
        checkGameTiles.reverse();
      }

      let filledNumbersIndex = 0;

      let baseCounter = 0;
      let counter = 0;

      checkGameTiles.forEach((t, i) => {
        if (filledNumbersIndex >= checkedNumbers.length) return;

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
          }
          counter = 0;
        }
      });

      if (inverse) {
        checkedNumbers.reverse();
        checkGameTiles.reverse();
      }

      return checkedNumbers;
    };

    numbers = checkCompleteNumbers();

    if (tiles.includes(0)) {
      numbers = checkCompleteNumbers(true);
    }

    return numbers;
  }

  #getTilesCounter(tiles = [0]) {
    return [...tiles].reduce((prev, curr, i) => {
      if (i == 1 && prev == -1) return curr;
      return curr == -1 ? prev : prev + curr;
    });
  }

  #getGameTileEl(x, y) {
    return document.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`);
  }

  #getTileIndex(tileEl) {
    return Number(tileEl.getAttribute("data-index"));
  }

  #getTileX(tileEl) {
    return Number(tileEl.getAttribute("data-x"));
  }

  #getTileY(tileEl) {
    return Number(tileEl.getAttribute("data-y"));
  }

  #showEl(element, display = "block") {
    element.style.display = display;
  }

  #hideEl(element) {
    element.style.display = "none";
  }
}
