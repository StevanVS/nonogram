import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Board } from '../interfaces/board.interface';
import { ServerResponse } from '../interfaces/server-response.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private api_url = environment.api_url;
  private http = inject(HttpClient)

  getList() {
    return this.http.get<ServerResponse<Board[]>>(`${this.api_url}/boards`);
  }

  createBoard(board: Board) {
    return this.http.post<ServerResponse<Board>>(`${this.api_url}/boards`, board)
  }

  updateBoard(board: Board) {
    return this.http.put<ServerResponse<Board>>(
      `${this.api_url}/boards/${board._id}`, board
    )
  }

  deleteBoard(boardId: string) {
    return this.http.delete<ServerResponse<any>>(`${this.api_url}/boards/${boardId}`)
  }
}
