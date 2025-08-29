import { Game } from "./game.interface";

export interface User {
  username: string;
  email: string;
  role: string;
  games: Game[]
}
