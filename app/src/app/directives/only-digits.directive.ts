import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDigitsOnly]',
})
export class OnlyDigitsDirective {
  // Evita escribir caracteres no numéricos
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') return;
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Evita pegar texto con caracteres inválidos
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, ''); // elimina todo lo que no sea dígito
  }
}
