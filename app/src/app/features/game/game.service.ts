import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { ServerResponse } from '../../core/models/server-response.model';
import { Board } from '../board-editor/board.model';
import { Game } from './models/game.model';
import { SkipLoading } from '../../core/interceptors/loading.interceptor';

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
      {
        context: new HttpContext().set(SkipLoading, true),
      },
    );
  }

  deleteAllGames() {
    return this.http.delete<ServerResponse<void>>(`${this.api_url}/games`);
  }
}
