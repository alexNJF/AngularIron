import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalculatorValidators } from '../../validators/calculator.validators';

@Component({
  selector: 'claculator-rectangularCans',
  templateUrl: './rectangular-cans.component.html',
  styleUrls: ['./rectangular-cans.component.scss']
})
export class RectangularCansComponent implements OnInit {
  form !: FormGroup;
  result: number = 0;
  result1M: number = 0;
  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm(): void {
    this.form = this.formBuilder.group({
      B: [null, [CalculatorValidators.gratherThan(0)]],
      H: [null, [CalculatorValidators.gratherThan(0)]],
      T: [null, [CalculatorValidators.gratherThan(0)]],
      L: [null, [CalculatorValidators.gratherThan(0)]],
      Count: [null, []],
    },
      { validators: CalculatorValidators.rect() });
    this.calcute();
  }
  calcute(): void {
    this.form.valueChanges.subscribe((change: any) => {
      this.result = 0;
      this.result1M = 0;
      if (this.form.get('B')?.valid &&
        this.form.get('T')?.valid &&
        this.form.get('H')?.valid &&
        this.form.get('B')?.value != this.form.get('H')?.value
      ) {
        let B = this.form.get('B')?.value;
        let T = this.form.get('T')?.value;
        let H = this.form.get('H')?.value;
        this.result1M = ((7.85 * (2 * T) * ((B - T) + (H - T))) / 1000);
      } else {
        this.result1M = 0;
      }

      if (this.form.valid) {
        let B = this.form.get('B')?.value;
        let H = this.form.get('H')?.value;
        let T = this.form.get('T')?.value;
        let L = this.form.get('L')?.value;
        let Count = this.form.get('Count')?.value > 0 ? this.form.get('Count')?.value : 1;
        this.result = ((7.85 * (2 * T) * ((B - T) + (H - T))) / 1000) * L * Count;
      } else {
        this.result = 0;
      }

    });
  }
}
