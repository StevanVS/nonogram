import { Component, ElementRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  private modalEl = viewChild.required<ElementRef<HTMLDialogElement>>('modal');

  titleText = input.required<string>();

  public showModal() {
    this.modalEl().nativeElement.showModal();
  }

  public closeModal() {
    this.modalEl().nativeElement.close();
  }
}
