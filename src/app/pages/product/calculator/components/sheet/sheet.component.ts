import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalculatorValidators } from '../../validators/calculator.validators';

@Component({
  selector: 'claculator-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent implements OnInit {
  form!: FormGroup;
  result = 0;
  result1M = 0;
  @Input('type') type!: number;
  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.createForm();
    console.log('type: ', this.type);
  }
  createForm(): void {
    this.form = this.formBuilder.group({
      T: [null, [CalculatorValidators.gratherThan(0)]],
      W: [null, [CalculatorValidators.gratherThan(0)]],
      L: [null, [CalculatorValidators.gratherThan(0)]],
      Count: [null, []],
    });
    this.calcute();
  }
  calcute(): void {
    this.form.valueChanges.subscribe((change: any) => {
      this.result = 0;
      this.result1M = 0;
      if (this.form.get('W')?.valid && this.form.get('T')?.valid) {
        const W = this.form.get('W')?.value;
        const T = this.form.get('T')?.value;
        this.result1M = (7.85 * (W * T)) / 1000;
      }
      if (this.form.valid) {
        const W = this.form.get('W')?.value;
        const T = this.form.get('T')?.value;
        const L = this.form.get('L')?.value;
        const Count =
          this.form.get('Count')?.value > 0 ? this.form.get('Count')?.value : 1;
        this.result = ((7.85 * (W * T)) / 1000) * L * Count;
      }
    });
  }
}
