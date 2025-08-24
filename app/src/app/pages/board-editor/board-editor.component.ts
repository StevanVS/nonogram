import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Board, voidBoard } from '../../interfaces/board.interface';
import { getImageSrc } from '../../utils/getImageSrc';
import { ImgBoardComponent } from '../../components/img-board/img-board.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ImageReaderComponent } from '../../components/image-reader/image-reader.component';
import { OnlyDigitsDirective } from '../../directives/only-digits.directive';

@Component({
  selector: 'app-board-editor',
  imports: [
    ImgBoardComponent,
    ReactiveFormsModule,
    ImageReaderComponent,
    OnlyDigitsDirective,
  ],
  templateUrl: './board-editor.component.html',
  styleUrl: './board-editor.component.css',
})
export class BoardEditorComponent {
  @ViewChild('formDialog') formDialog!: ElementRef<HTMLDialogElement>;

  board: Board = voidBoard();
  coloredBoard: Board = voidBoard();
  filledBoard: Board = voidBoard();

  boardList: Board[] = [
    {
      id: '1',
      filledTiles: [
        0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0,
        0,
      ],
      coloredTiles: [
        '#2cd3ad',
        '#f27070',
        '#2cd3ad',
        '#f21414',
        '#2cd3ad',
        '#f27070',
        '#ffffff',
        '#f21414',
        '#f21414',
        '#f21414',
        '#f21414',
        '#f21414',
        '#f21414',
        '#f21414',
        '#f21414',
        '#2cd3ad',
        '#f21414',
        '#f21414',
        '#ab0e0e',
        '#2cd3ad',
        '#2cd3ad',
        '#2cd3ad',
        '#ab0e0e',
        '#2cd3ad',
        '#2cd3ad',
      ],
      width: 5,
      height: 5,
      name: 'Heart',
      innerColumn: 0,
      innerRow: 0,
      filledTilesNumber: 0,
      columnNumbers: [],
      rowNumbers: [],
      level: 1,
      order: 1,
      subGrid: 0,
    },
    {
      id: '2',
      name: 'Bird',
      width: 10,
      height: 10,
      filledTiles: [
        0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0,
        1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1,
        1, 0, 0, 0,
      ],
      coloredTiles: [
        '#01bbd4',
        '#01bbd4',
        '#785448',
        '#785448',
        '#785448',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
        '#785448',
        '#fedaaa',
        '#fedaaa',
        '#fedaaa',
        '#785448',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
        '#785448',
        '#fdc006',
        '#fedaaa',
        '#000000',
        '#fedaaa',
        '#c48542',
        '#785448',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
        '#785448',
        '#fedaaa',
        '#fedaaa',
        '#fedaaa',
        '#c48542',
        '#785448',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
        '#785448',
        '#fedaaa',
        '#fedaaa',
        '#fedaaa',
        '#c48542',
        '#785448',
        '#01bbd4',
        '#785448',
        '#785448',
        '#785448',
        '#fedaaa',
        '#fedaaa',
        '#fedaaa',
        '#fedaaa',
        '#fedaaa',
        '#c48542',
        '#785448',
        '#c48542',
        '#785448',
        '#785448',
        '#fedaaa',
        '#fedaaa',
        '#fedaaa',
        '#fedaaa',
        '#785448',
        '#fedaaa',
        '#c48542',
        '#c48542',
        '#785448',
        '#785448',
        '#fedaaa',
        '#fedaaa',
        '#fedaaa',
        '#fedaaa',
        '#fedaaa',
        '#785448',
        '#c48542',
        '#785448',
        '#01bbd4',
        '#785448',
        '#c48542',
        '#785448',
        '#c48542',
        '#785448',
        '#c48542',
        '#c48542',
        '#785448',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
        '#785448',
        '#fdc006',
        '#785448',
        '#fdc006',
        '#785448',
        '#785448',
        '#01bbd4',
        '#01bbd4',
        '#01bbd4',
      ],
      innerColumn: 0,
      innerRow: 0,
      filledTilesNumber: 0,
      columnNumbers: [],
      rowNumbers: [],
      level: 2,
      order: 2,
      subGrid: 0,
    },
  ];

  private formBuilder: FormBuilder = inject(FormBuilder);

  boardForm: FormGroup;

  constructor() {
    this.boardForm = this.formBuilder.group(
      {
        id: [this.board.id],
        name: [this.board.name, [Validators.required]],
        order: [
          this.board.order,
          [Validators.required, Validators.pattern(/^\d+$/)],
        ],
        subGrid: [this.board.subGrid, [Validators.pattern(/^\d+$/)]],
        colored: this.formBuilder.group({
          tiles: [this.board.coloredTiles, [Validators.required]],
          width: [0, [Validators.required]],
          height: [0, [Validators.required]],
        }),
        filled: this.formBuilder.group({
          tiles: [this.board.filledTiles, [Validators.required]],
          width: [0, [Validators.required]],
          height: [0, [Validators.required]],
        }),
      },
      {
        // sameDimensionsValidator
      }
    );
  }

  showDialogForm() {
    this.formDialog.nativeElement.showModal();
  }

  onCreate() {
    this.board = voidBoard();
    this.coloredBoard = voidBoard();
    this.filledBoard = voidBoard();
    this.boardForm.reset();
    this.showDialogForm();
  }

  onEdit(board: Board) {
    this.board = board;
    this.coloredBoard = board;
    this.filledBoard = board;
    this.boardForm.patchValue(board);
    this.showDialogForm();
  }

  onDelete(board: Board) {}

  onSubmit() {
    console.log('name', this.boardForm.value);
    if (!this.boardForm.valid) {
      alert('form not valid');
      return;
    }

    if (this.filledBoard.width != this.coloredBoard.width)
      if (this.board.id == null) {
        //create
      } else {
        //update
      }
  }

  onColoredBoardChange() {}
}
