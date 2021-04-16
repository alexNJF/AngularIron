export class Fa2EnNumUtil {

  static faNumbers: { value: string, enNum: string }[] = [
    {
      value: '۰',
      enNum: '0'
    },
    {
      value: '۱',
      enNum: '1'
    },
    {
      value: '۲',
      enNum: '2'
    },
    {
      value: '۳',
      enNum: '3'
    },
    {
      value: '۴',
      enNum: '4'
    },
    {
      value: '۵',
      enNum: '5'
    },
    {
      value: '۶',
      enNum: '6'
    },
    {
      value: '۷',
      enNum: '7'
    },
    {
      value: '۸',
      enNum: '8'
    },
    {
      value: '۹',
      enNum: '9'
    }
  ];

  static transform(value: string | number, asNumber: boolean = true): number | string {
    const strVal: string = String(value || '').trim()
      .split('')
      .map((char) => {
        const faNumber = this.faNumbers.find(w => w.value === char);
        if (!faNumber) {
          return char;
        }
        return faNumber.enNum;
      })
      .join('');
    const numVal: number = Number(strVal);
    return asNumber ? numVal : strVal;
  }

  static hasAny(value: string | number): boolean {
    const strVal = String(value || '').trim();
    if (!strVal) {
      return false;
    }
    const numbers = this.faNumbers.map((item) => item.value);
    let has = false;
    strVal.split('').forEach((char) => {
      if (numbers.find(w => w === char)) {
        has = true;
      }
    });
    return has;
  }

}
