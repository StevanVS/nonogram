import { Component, ElementRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  canCloseOnClickOutside = input<boolean>(false);

  private modalEl = viewChild.required<ElementRef<HTMLDialogElement>>('modal');

  titleText = input.required<string>();

  onDialogClick(event: MouseEvent) {
    if (!this.canCloseOnClickOutside()) return;

    const dialog = this.modalEl().nativeElement;
    const rect = dialog.getBoundingClientRect();

    // Si clic fuera del rectángulo → cerrar
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      this.closeModal();
      // console.log('cerrar')
    }
  }

  public showModal() {
    this.modalEl().nativeElement.showModal();
  }

  public closeModal() {
    this.modalEl().nativeElement.close();
  }
}
