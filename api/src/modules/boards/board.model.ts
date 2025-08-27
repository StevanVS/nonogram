import { model, Schema } from "mongoose";
import {
  getColumnNumbers,
  getFilledTilesNumber,
  getRowNumbers,
} from "../../utils/boards";

const boardSquema = new Schema({
  name: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  filledTiles: { type: [Number], required: true },
  coloredTiles: { type: [String], required: true },
  filledTilesNumber: { type: Number },
  columnNumbers: { type: Schema.Types.Mixed },
  rowNumbers: { type: Schema.Types.Mixed },
  order: { type: Number, default: 0 },
  subGrid: { type: Number, default: 0 },
});


boardSquema.pre("save", function (next) {
  this.filledTilesNumber = getFilledTilesNumber(this);
  this.columnNumbers = getColumnNumbers(this);
  this.rowNumbers = getRowNumbers(this);
  next();
});

boardSquema.pre("findOneAndUpdate", function (next) {
  const board = this.getUpdate();
  this.set({
    filledTilesNumber: getFilledTilesNumber(board),
    columnNumbers: getColumnNumbers(board),
    rowNumbers: getRowNumbers(board),
  });
  next();
});

export const Board = model("Board", boardSquema);
