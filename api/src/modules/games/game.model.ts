import { model, Schema } from "mongoose";

const gameSchema = new Schema(
  {
    boardId: String,
    gameTiles: [Number],
    history: [Schema.Types.Mixed],
  },
  {
    timestamps: true,
    methods: {
      // // Compare the given password with the hashed password in the database
      // async comparePassword(password: string) {
      //   return bcrypt.compare(password, this.password);
      // },
    },
  }
);

gameSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
});

export const Game = model("Game", gameSchema);
