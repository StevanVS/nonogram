import { model, Schema } from "mongoose";
import {
  getColumnNumbers,
  getFilledTilesCount,
  getRowNumbers,
} from "./board.utils";
import { Board } from "../../interfaces/board";

const boardSquema = new Schema<Board>({
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

export const BoardModel = model("Board", boardSquema);
