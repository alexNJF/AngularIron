import { FormArray, FormGroup } from '@angular/forms';
import { ElementRef } from '@angular/core';

export class FormUtil {
  static reactiveIsValid(form: FormGroup | FormArray, elementRef: ElementRef, focusOnFail: boolean = true): boolean {
    for (const key of Object.keys(form.controls)) {
      const control = form.get(key);
      if (control instanceof FormArray) {
        this.reactiveIsValid(control, elementRef, focusOnFail);
      } else {
        if (control?.enabled && control?.invalid) {
          if (focusOnFail) {
            const invalidElement: HTMLElement = elementRef.nativeElement.querySelector(`[formControlName="${key}"]`);
            invalidElement.focus();
          }
          return false;
        }
      }
    }
    return true;
  }
}
