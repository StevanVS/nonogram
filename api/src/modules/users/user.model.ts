import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    games: [
      {
        boardId: String,
        gameTiles: [Number],
        history: [Schema.Types.Mixed],
      },
    ],
  },
  {
    timestamps: true,
    methods: {
      // Compare the given password with the hashed password in the database
      async comparePassword(password: string) {
        return bcrypt.compare(password, this.password);
      },
    },
  }
);

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
});

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    console.error(error);
    return next();
  }
});

export const UserModel = model("User", userSchema);
