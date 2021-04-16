import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[appTwoDigitDecimaNumber]'
})
export class TwoDigitDecimaNumberDirective {
  @Input() digit!: string;
  @Input() float!: string;
  selectedInput:boolean=false;

  private regex: RegExp = new RegExp(/^[1-9]*\.?\d{0,3}?$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) {
  }

  @HostListener('keypress', ['$event'])
  onKeyDown(event: any) {
    if (this.selectedInput===true){
      event.target.value=null
      this.selectedInput=false
    }
    let res = true;
    let dfArray = [Number(this.digit), Number(this.float)]
    let index = 0;
    let value = (event.target?.value + event.key) as string;
    let tmp = value.split('.');
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 &&
      (charCode < 46 || charCode > 57) ||
      charCode == 47 ||
      tmp.length > 2
    ) {
      res = false;
      return false;
    }
    tmp.forEach((item: string) => {
      if (item.length > dfArray[index])
        res = false;
      index = index + 1

    })
    return res;
  }

  @HostListener('select', ["$event"]) onSelect(event: any) {
      console.log("on select: ",event.target.selectionStart)
      console.log("on select end: ",event.target.selectionEnd)
      console.log("on select value: ",event.target.value.length)
      if (event.target.selectionEnd-event.target.selectionStart==event.target.value.length){
       this.selectedInput=true
      }
  }
}