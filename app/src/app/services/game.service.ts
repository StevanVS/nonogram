import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Game } from '../interfaces/game.interface';
import { Response } from '../interfaces/response.interface';
import { Tile } from '../interfaces/tile.interface';
import { CheckGameWin } from '../interfaces/check-game-win.interface';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private api_url = environment.api_url;
  private http = inject(HttpClient)

  constructor() { }

  getNewGame(boardId: string) {
    return this.http.get<Response<Game>>(`${this.api_url}/game/newgame/${boardId}`);
  }

  getNewGameByLevel(level: number) {
    return this.http.get<Response<Game>>(`${this.api_url}/game/newgamebylevel/${level}`);
  }

  checkGameWin(boardId: string, gameTiles: Tile[]) {
    return this.http.post<Response<CheckGameWin>>(`${this.api_url}/game/checkgamewin/${boardId}`, { gameTiles });
  }
}
