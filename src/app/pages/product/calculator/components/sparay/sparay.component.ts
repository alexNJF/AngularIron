import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'claculator-sparay',
  templateUrl: './sparay.component.html',
  styleUrls: ['./sparay.component.scss']
})
export class SparayComponent implements OnInit {
  form!:FormGroup;

  result:number=0;
  H:number|string="mm";
  B:number|string="mm";
  S:number|string="mm";
  T:number|string="mm";
  WEIGHT:number|string=0;
  AREA:number|string="mm";

  jsonData: any[] = [];
  constructor(
    private httpService: HttpClient,
    private formBuilder:FormBuilder,
    ) {}

  ngOnInit(): void {
    this.loadData();
    this.cerateForm();
  }
  loadData() {
    this.httpService.get('assets/data/SPARY_DATA.json').subscribe((Data: any) => {
      this.jsonData = Data as any[];
    });
  }
  cerateForm():void{
    this.form=this.formBuilder.group({
      L:[null],
      Count:[null,[]],
      value:[null,[Validators.required]],
    });
    this.calcute();
  }
  calcute():void{
    this.form.valueChanges.subscribe((change:any)=>{
      this.result=0;

      if(this.form.valid)
      {
        let L= this.form.get('L')?.value>0?this.form.get('L')?.value:1;
        let Count= this.form.get('Count')?.value>0?this.form.get('Count')?.value:1;
        let value= this.form.get('value')?.value;
        this.result=Count*L*value.WEIGHT;
        this.H=value.H;
        this.B=value.B;
        this.S=value.S;
        this.T=value.T;
        this.WEIGHT=value.WEIGHT;

      }
    });
  }

}
