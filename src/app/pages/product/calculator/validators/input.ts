export class InputControl
{
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  floatNumber(event: any, digit: number, float: number): boolean {
    console.log("keypress event: ",event)

  
    let res = true;
    let dfArray = [digit, float]
    let index = 0;
    let value = (event.target.value + event.key) as string;
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

}
