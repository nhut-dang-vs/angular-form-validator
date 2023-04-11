import { AbstractControl, ValidationErrors } from '@angular/forms';

export function NoWhiteSpaceValidator(
  control: AbstractControl
): ValidationErrors | null {
  const { value: controlVal } = control;
  const isWhiteSpaceOnly = (controlVal || '').trim().length === 0;

  return isWhiteSpaceOnly ? { whitespace: 'value is only whitespace' } : null;
}
