import { Component, inject } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../interfaces/board.interface';
import { BoardDetailsComponent } from '../../components/board-details/board-details.component';
import { ImageReaderComponent } from '../../components/image-reader/image-reader.component';

@Component({
  selector: 'app-edit-levels',
  standalone: true,
  imports: [BoardDetailsComponent, ImageReaderComponent],
  templateUrl: './edit-levels.component.html',
  styleUrl: './edit-levels.component.css',
})
export class EditLevelsComponent {
  edit: boolean = true;
  list: boolean = true;

  boards: Board[] = [];

  board: Board = {};

  private boardService: BoardService = inject(BoardService);
  constructor() {}

  ngOnInit() {
    this.boardService.getList().subscribe((values) => {
      if (values.ok) {
        this.boards = values.datos;
        console.log(this.boards);
      }
    });
  }

  onImageRead(board: Board) {
    this.board = board;
  }
}
