import { Document, WithId } from "mongodb";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
}

export interface UserDocument extends WithId<User> { }
