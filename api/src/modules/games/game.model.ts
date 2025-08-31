import { model, Schema } from "mongoose";
import { Game } from "../../interfaces/game";

const gameSquema = new Schema<Game>({
  boardId: String,
  userId: String,
  gameTiles: [Number],
  history: [Schema.Types.Mixed],
});

gameSquema.set("toJSON", {
  virtuals: true,
  versionKey: false,
});

export const GameModel = model("Game", gameSquema);
