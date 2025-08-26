import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static sameDimensions: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const coloredBoard = control.get('coloredBoard');
    const filledBoard = control.get('filledBoard');

    if (
      coloredBoard &&
      coloredBoard.value &&
      filledBoard &&
      filledBoard.value &&
      coloredBoard.value.width != filledBoard.value.width &&
      coloredBoard.value.height != filledBoard.value.height
    )
      return { sameDimensions: true };

    return null;
  };
}
