import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Game } from '../interfaces/game.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { Board } from '../interfaces/board.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private api_url = environment.api_url;
  private http = inject(HttpClient);

  getNewGame(boardId: string) {
    return this.http.get<ServerResponse<{ board: Board; game: Game }>>(
      `${this.api_url}/games/getnewgame/${boardId}`,
    );
  }

  getGame(boardId: string, game?: Game | null) {
    return this.http.post<ServerResponse<{ board: Board; game: Game }>>(
      `${this.api_url}/games/getgame/${boardId}`,
      { game },
    );
  }

  saveGame(game: Game) {
    return this.http.post<ServerResponse<void>>(
      `${this.api_url}/games/savegame`,
      { game },
    );
  }

  deleteAllGames() {
    return this.http.delete<ServerResponse<void>>(`${this.api_url}/games`);
  }
}
