import { Component, inject } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board, voidBoard } from '../../interfaces/board.interface';
import { BoardDetailsComponent } from '../../components/board-details/board-details.component';
import { ImageReaderComponent } from '../../components/image-reader/image-reader.component';
import { ImgBoardComponent } from '../../components/img-board/img-board.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';

@Component({
  selector: 'app-edit-levels',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BoardDetailsComponent,
    ImageReaderComponent,
    ImgBoardComponent,
  ],
  templateUrl: './edit-levels.component.html',
  styleUrl: './edit-levels.component.css',
})
export class EditLevelsComponent {
  edit: boolean = false;
  list: boolean = true;

  boardList: Board[] = [];

  board: Board = voidBoard();

  private formBuilder: FormBuilder = inject(FormBuilder);
  private boardService: BoardService = inject(BoardService);

  boardForm: FormGroup;

  constructor() {
    this.boardForm = this.formBuilder.group({
      name: ['', Validators.required],
      level: [0, Validators.required],
      width: [0, Validators.required],
      height: [0, Validators.required],
      filledTiles: [[], Validators.required],
      coloredTiles: [[], Validators.required],
      innerColumn: [0],
      innerRow: [0],
    });
  }

  ngOnInit() {
    this.boardService.getList().subscribe((values) => {
      if (values.ok) {
        this.boardList = values.datos;
        console.log(this.boardList);
      }
    });
  }

  onImageRead(board: Board) {
    this.boardForm.patchValue({
      width: board.width,
      height: board.height,
      filledTiles: board.filledTiles,
      coloredTiles: board.coloredTiles,
    });
  }

  onNewBoard() {
    this.boardForm.patchValue(voidBoard());
    this.board = voidBoard();
    this.edit = true;
    this.list = false;
  }

  onEditBoard(board: Board) {
    this.boardForm.patchValue(board);
    this.board = board;
    this.edit = true;
    this.list = false;
  }

  onDeleteBoard() {
    if (this.board.id == null) return;
    this.boardService.deleteBoard(this.board.id).subscribe({
      next: (res) => {
        if (res.ok) {
          this.boardList = this.boardList.filter(
            (b) => b.id !== this.board.id
          );
          this.list = true;
          this.edit = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  saveBoard() {
    if (this.boardForm.invalid) return;

    Object.assign(this.board, this.boardForm.value);

    if (this.board.id == null) {
      console.log(this.board);
      this.boardService.createBoard(this.board).subscribe({
        next: (res) => {
          if (res.ok) {
            console.log('creado con exito');
            this.boardList.push(res.datos);

            this.edit = false;
            this.list = true;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.boardService.updateBoard(this.board).subscribe({
        next: (res) => {
          if (res.ok) {
            console.log('updated with exito');
            const index = this.boardList.findIndex(
              (b) => b.id === this.board.id
            );
            this.boardList[index] = res.datos;

            this.edit = false;
            this.list = true;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
