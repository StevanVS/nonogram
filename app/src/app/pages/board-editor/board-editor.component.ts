import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Board, voidBoard } from '../../interfaces/board.interface';
import { ImgBoardComponent } from '../../components/img-board/img-board.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { OnlyDigitsDirective } from '../../directives/only-digits.directive';
import { ImgBoardInputComponent } from '../../components/img-board-input/img-board-input.component';
import { BoardService } from '../../services/board.service';
import { CustomValidators } from '../../directives/custom-validators.directive';

@Component({
  selector: 'app-board-editor',
  imports: [
    ImgBoardComponent,
    ReactiveFormsModule,
    OnlyDigitsDirective,
    ImgBoardInputComponent,
  ],
  templateUrl: './board-editor.component.html',
  styleUrl: './board-editor.component.css',
})
export class BoardEditorComponent {
  @ViewChild('formDialog') formDialog!: ElementRef<HTMLDialogElement>;

  board: Board = voidBoard();

  boardList: Board[] = [];

  private formBuilder = inject(FormBuilder);
  private boardService = inject(BoardService);

  boardForm: FormGroup;

  constructor() {
    this.boardForm = this.formBuilder.group(
      {
        name: [
          this.board.name,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        coloredBoard: [null, [Validators.required]],
        filledBoard: [null, [Validators.required]],
        order: [
          this.board.order,
          [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)],
        ],
        subGrid: [
          this.board.subGrid,
          [Validators.pattern(/^\d+$/), Validators.min(0)],
        ],
      },
      {
        validators: [CustomValidators.sameDimensions],
      },
    );
  }

  ngOnInit() {
    this.getBoardList();
  }

  getBoardList() {
    this.boardService.getList().subscribe((values) => {
      if (values.ok) {
        this.boardList = values.datos.map((b) => ({ id: b._id, ...b }));
        console.log(this.boardList);
      }
    });
  }

  showFormDialog() {
    this.formDialog.nativeElement.showModal();
  }

  closeFormDialog() {
    this.formDialog.nativeElement.close();
  }

  onCreate() {
    this.board = voidBoard();
    this.boardForm.reset();
    this.boardForm.patchValue(voidBoard());
    this.showFormDialog();
  }

  onEdit(board: Board) {
    this.board = board;
    this.boardForm.patchValue(board);
    this.boardForm.patchValue({
      coloredBoard: {
        tiles: board.coloredTiles,
        width: board.width,
        height: board.height,
      },
      filledBoard: {
        tiles: board.filledTiles,
        width: board.width,
        height: board.height,
      },
    });
    this.showFormDialog();
  }

  onDelete(board: Board) {
    if (board.id == null) return;
    this.boardService.deleteBoard(board.id).subscribe({
      next: (res) => {
        if (res.ok) {
          // this.boardList = this.boardList.filter((b) => b.id !== this.board.id);
          this.getBoardList();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSubmit() {
    if (this.boardForm.invalid) {
      alert('form not valid');
      return;
    }

    Object.assign(this.board, this.boardForm.value);
    this.board.width = this.boardForm.get('coloredBoard')?.value.width;
    this.board.height = this.boardForm.get('coloredBoard')?.value.height;
    this.board.coloredTiles = this.boardForm.get('coloredBoard')?.value.tiles;
    this.board.filledTiles = this.boardForm.get('filledBoard')?.value.tiles;

    console.log(this.board);
    if (this.board.id == null) {
      //create
      this.boardService.createBoard(this.board).subscribe({
        next: (res) => {
          if (res.ok) {
            console.log('creado con exito');
            this.getBoardList();
            // const board: Board = { id: res.datos._id, ...res.datos };
            // this.boardList.push(board);
            
            this.closeFormDialog();
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      //update
      this.boardService.updateBoard(this.board).subscribe({
        next: (res) => {
          if (res.ok) {
            console.log('updated with exito');
            this.getBoardList();

            // const index = this.boardList.findIndex(
            //   (b) => b.id === this.board.id,
            // );

            // const board: Board = { id: res.datos._id, ...res.datos };
            // this.boardList[index] = board;

            this.closeFormDialog();
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
