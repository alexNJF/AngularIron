import { AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";

export class CalculatorValidators {

  static rect (): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const _B = control.get('B')?.value;
      const _H = control.get('H')?.value;
      return _B&&_H&&_B!=_H? null : { notrect: true, message: "incorrect" }
    };
  }

  /*------------------------------------------
 * Just Number Validator
 *------------------------------------------*/
  static number(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const _value = control.value;
      return _value && _value.toString().match(/^[0-9]+(\.?[0-9]+)?$/) ? null : { incorrect: true, message: "Value Must Be Number Only" }
    };
  };

  /*------------------------------------------
 * Just Number Validator
 * Check If Value Grather Than input
 *------------------------------------------*/
  static gratherThan(input: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const _value = control.value;
      return _value && _value.toString().match(/^[0-9]+(\.?[0-9]+)?$/) && _value > input ? null : { incorrect: true, message: "Value Must Be Number Only" }
    };
  };




}
