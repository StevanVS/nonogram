import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game, Tile, voidGame } from '../../interfaces/game.interface';
import { GameTilesNumber } from '../../interfaces/game-axis-numbers';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.css'
})
export class GameBoardComponent {
  // @Input({ required: true }) game: Game = voidGame()
  // @Input({ required: true }) gameTiles: Tile[] = []
  // @Input({ required: true }) columnNumbers: FilledTilesNumber[][] = []
  // @Input({ required: true }) rowNumbers: FilledTilesNumber[][] = []


  // @Output('onHistoryBack') historyBack: EventEmitter<void> = new EventEmitter()
  // @Output('onMouseDown') mouseDown: EventEmitter<MouseEvent> = new EventEmitter()
  // @Output('onMouseMove') mouseMove: EventEmitter<MouseEvent> = new EventEmitter()

  // onHistoryBack() {
  //   this.historyBack.emit()
  // }

  // onContextMenu(e: Event) {
  //   e.preventDefault();
  // }

  // onMouseDown(e: MouseEvent) {
  //   this.mouseDown.emit(e)
  // }

  // onMouseMove(e: MouseEvent) {
  //   this.mouseMove.emit(e)
  // }

  // lastValue: string = ''
  // isGroupNumbersComplete(
  //   groupNumbers: { number: number; complete: boolean }[], index: number, type: string
  // ) {
  //   let isEqLength: boolean = false;
  //   if (type === 'column') {
  //     isEqLength = this.game.columnNumbers[index].length === groupNumbers.length
  //   } else if (type === 'row') {
  //     isEqLength = this.game.rowNumbers[index].length === groupNumbers.length
  //   }

  //   let isComplete = groupNumbers.every((n) => n.complete);
  //   if (type == 'column' && index == 0) {
  //     const value  = {
  //       column: this.game.columnNumbers[index],
  //       groupNumbers,
  //       isEqLength,
  //       isComplete
  //     }
  //     if (this.lastValue !== JSON.stringify(value)) {
  //       console.log(value);
  //       this.lastValue = JSON.stringify(value)
  //     }
  //   }

  //   return isEqLength && isComplete
  // }

  // getThickBorder(index: number) {
  //   const [x, y] = this.getXY(index)
  //   const border = '2px solid'

  //   let borderX = {}
  //   if (this.game.innerColumn > 0 && this.game.innerColumn !== this.game.width) {
  //     borderX = {
  //       borderRight: x % this.game.innerColumn === this.game.innerColumn - 1 ? border : '',
  //       borderLeft: x % this.game.innerColumn === 0 ? border : '',
  //     }
  //   }

  //   let borderY = {}
  //   if (this.game.innerRow > 0 && this.game.innerRow !== this.game.height) {
  //     borderY = {
  //       borderTop: y % this.game.innerRow === 0 ? border : '',
  //       borderBottom: y % this.game.innerRow === this.game.innerRow - 1 ? border : ''
  //     }
  //   }

  //   return {
  //     ...borderX,
  //     ...borderY,
  //   }
  // }

  // getXY(index: number): [number, number] {
  //   let x = index % this.game.width;
  //   let y = Math.floor(index / this.game.width);
  //   return [x, y]
  // }
}
