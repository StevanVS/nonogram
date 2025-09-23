import { Component, inject, viewChild } from '@angular/core';
import { Board, voidBoard } from './board.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { OnlyDigitsDirective } from '../../shared/directives/only-digits.directive';
import { BoardService } from './board.service';
import { CustomValidators } from '../../shared/directives/custom-validators.directive';
import { ImgBoardInputComponent } from '../../shared/components/img-board-input/img-board-input.component';
import { ImgBoardComponent } from '../../shared/components/img-board/img-board.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-board-editor',
  imports: [
    ImgBoardComponent,
    ReactiveFormsModule,
    OnlyDigitsDirective,
    ImgBoardInputComponent,
    ModalComponent,
  ],
  templateUrl: './board-editor.component.html',
  styleUrl: './board-editor.component.css',
})
export class BoardEditorComponent {
  formModal = viewChild.required<ModalComponent>('formModal');
  deleteModal = viewChild.required<ModalComponent>('deleteModal');

  board: Board = voidBoard();

  boardList: Board[] = [];

  boardForm: FormGroup;

  submitted = false;

  private formBuilder = inject(FormBuilder);
  private boardService = inject(BoardService);

  constructor() {
    this.boardForm = this.formBuilder.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        coloredBoard: [null, [Validators.required]],
        filledBoard: [null, [Validators.required]],
        order: [
          null,
          [Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)],
        ],
        subGrid: [null, [Validators.pattern(/^\d+$/), Validators.min(0)]],
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
        // this.boardList = values.datos.map((b) => ({ id: b.id, ...b }));
        this.boardList = values.datos;
        console.log(this.boardList);
      }
    });
  }

  onCreate() {
    this.submitted = false;
    this.board = voidBoard();
    this.boardForm.reset();
    this.boardForm.patchValue(voidBoard());
    this.formModal().showModal();
  }

  onEdit(board: Board) {
    this.submitted = false;
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
    this.formModal().showModal();
  }

  onDelete(board: Board) {
    this.board = board;
    this.deleteModal().showModal();
  }

  delete() {
    if (this.board.id == null) return;
    this.boardService.deleteBoard(this.board.id).subscribe({
      next: (res) => {
        if (res.ok) {
          // this.boardList = this.boardList.filter((b) => b.id !== this.board.id);
          this.getBoardList();
          this.deleteModal().closeModal();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.boardForm.invalid) return;

    Object.assign(this.board, this.boardForm.value);
    this.board.width = this.boardForm.get('coloredBoard')?.value.width;
    this.board.height = this.boardForm.get('coloredBoard')?.value.height;
    this.board.coloredTiles = this.boardForm.get('coloredBoard')?.value.tiles;
    this.board.filledTiles = this.boardForm.get('filledBoard')?.value.tiles;

    console.log('board on submit', this.board);
    if (this.board.id == null) {
      //create
      this.boardService.createBoard(this.board).subscribe({
        next: (res) => {
          if (res.ok) {
            console.log('creado con exito');
            this.getBoardList();
            // const board: Board = { id: res.datos._id, ...res.datos };
            // this.boardList.push(board);

            this.formModal().closeModal();
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

            this.formModal().closeModal();
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
