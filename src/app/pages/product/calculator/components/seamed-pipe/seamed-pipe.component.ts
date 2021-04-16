import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalculatorValidators } from '../../validators/calculator.validators';

@Component({
  selector: 'claculator-seamedPipe',
  templateUrl: './seamed-pipe.component.html',
  styleUrls: ['./seamed-pipe.component.scss']
})
export class SeamedPipeComponent implements OnInit {
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
      D:     [null, [CalculatorValidators.gratherThan(0)]],
      T:     [null, [CalculatorValidators.gratherThan(0)]],
      L:     [null, [CalculatorValidators.gratherThan(0)]],
      Count: [null, []],
    });
    this.calcute();
  }
  calcute(): void {
    this.form.valueChanges.subscribe((change: any) => {
      this.result=0;
      this.result1M=0;
      if (this.form.get('T')?.valid &&
          this.form.get('D')?.valid) {
        let D = this.form.get('D')?.value;
        let T = this.form.get('T')?.value;
        this.result1M = ((7.85 * 3.14 * T * (D - T)) / 1000);
      }

      if (this.form.valid) {
        let D = this.form.get('D')?.value;
        let T = this.form.get('T')?.value;
        let L = this.form.get('L')?.value;
        let Count = this.form.get('Count')?.value > 0 ? this.form.get('Count')?.value : 1;
        this.result = ((7.85 * 3.14 * T * (D - T)) / 1000) * L * Count;
      }
    });
  }
}
