import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'claculator-gnabshi',
  templateUrl: './gnabshi.component.html',
  styleUrls: ['./gnabshi.component.scss']
})
export class GNabshiComponent implements OnInit {
  form!:FormGroup;
  _components?:any


  result:number=0;
  WEIGHT:number=0;


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

    this.httpService.get('assets/data/GNABSHI_DATA.json').subscribe((Data: any) => {
      this.jsonData = Data as any[];
    });
  }
  cerateForm():void{
    this.form=this.formBuilder.group({
      L:[null],
      Count:[null,[]],
      components:[null,[Validators.required]],
      WEIGHT1M:[null,[Validators.required]]
    });
    this.loadT();
    this.calcute();

  }
  loadT(){
    this.form.get('components')?.valueChanges.subscribe((value:any)=>{
      this._components=value;
    })
  }
  calcute():void{

    this.form.valueChanges.subscribe((change:any)=>{
      console.log(this.form);


      if(this.form.valid)
      {
        let L= this.form.get('L')?.value>0?this.form.get('L')?.value:1;
        let Count= this.form.get('Count')?.value>0?this.form.get('Count')?.value:1;
        let value1M= this.form.get('WEIGHT1M')?.value;
        this.result=Count*L*value1M;
        this.WEIGHT=value1M;
      }
    });
  }

  checkClear(event:any)
  {

      event.handleClearClick();
      this.result=0;
      this.WEIGHT=0;

  }

}
