import { model, Schema } from "mongoose";
import {
  getColumnNumbers,
  getFilledTilesCount,
  getRowNumbers,
} from "./board.utils";
import { Board } from "../../interfaces/board";

interface BoardDocument extends Board, Document {
  // declare any instance methods here
  isGameComplete(gameTiles: number[]): boolean;
  getProgressPercentage(gameTiles: number[]): number;
}

const boardSquema = new Schema<BoardDocument>({
  name: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  filledTiles: { type: [Number], required: true },
  coloredTiles: { type: [String], required: true },
  filledTilesCount: { type: Number },
  columnNumbers: { type: Schema.Types.Mixed },
  rowNumbers: { type: Schema.Types.Mixed },
  order: { type: Number, default: 0 },
  subGrid: { type: Number, default: 0 },
});

boardSquema.set("toJSON", {
  virtuals: true,
  versionKey: false,
});

boardSquema.pre("save", function (next) {
  this.filledTilesCount = getFilledTilesCount(this);
  this.columnNumbers = getColumnNumbers(this);
  this.rowNumbers = getRowNumbers(this);
  next();
});

boardSquema.pre("findOneAndUpdate", function (next) {
  const board = this.getUpdate() as Board;
  this.set({
    filledTilesCount: getFilledTilesCount(board),
    columnNumbers: getColumnNumbers(board),
    rowNumbers: getRowNumbers(board),
  });
  next();
});

boardSquema.methods.isGameComplete = function (gameTiles: number[]): boolean {
  return gameTiles.every((gt, i) => {
    let gameTile = gt <= 0 ? 0 : 1;
    const isCorrect = gameTile === this.filledTiles[i];
    return isCorrect;
  });
};

boardSquema.methods.getProgressPercentage = function (
  gameTiles: number[]
): number {
  const gameTilesCount = gameTiles.reduce<number>(
    (count, num) => (num === 1 ? count + 1 : count),
    0
  );
  const progressRatio = parseFloat(
    (gameTilesCount / this.filledTilesCount).toFixed(2)
  );
  return progressRatio * 100;
};

export const BoardModel = model("Board", boardSquema);
