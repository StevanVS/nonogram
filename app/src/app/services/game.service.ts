import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Game } from '../interfaces/game.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { Tile } from '../interfaces/tile.interface';
import { CheckGameWin } from '../interfaces/check-game-win.interface';
import { sendRequest } from '../utils/request';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private api_url = environment.api_url;
  private http = inject(HttpClient);

  constructor() {}

  getNewGame(boardId: string) {
    return this.http.get<ServerResponse<Game>>(
      `${this.api_url}/game/newgame/${boardId}`,
    );
    //return sendRequest<Game>(
    //  this.http,
    //  'GET',
    //  `${this.api_url}/game/newgame/${boardId}`,
    //);
  }

  getNewGameByLevel(level: number) {
    //return this.http.get<ServerResponse<Game>>(
    //  `${this.api_url}/game/newgamebylevel/${level}`,
    //);
    //
    return sendRequest<Game>(
      this.http,
      'GET',
      `${this.api_url}/game/newgamebylevel/${level}`,
    );
  }

  checkGameWin(level: number, gameTiles: Tile[]) {
    //return this.http.post<ServerResponse<CheckGameWin>>(
    //  `${this.api_url}/game/checkgamewin/${level}`,
    //  { gameTiles },
    //);

    return sendRequest<CheckGameWin>(
      this.http,
      'POST',
      `${this.api_url}/game/checkgamewin/${level}`,
      { gameTiles },
    );
  }
}
