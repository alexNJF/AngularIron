import { ITimestampDiff } from '../app.interface';

export class TimestampUtil {

  static diff(one: number, two: number): ITimestampDiff {
    const diff: number = one - two;
    const isNow: boolean = diff === 0;
    const isPast: boolean = diff < 0;
    const days: number = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours: number = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes: number = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds: number = Math.floor((diff % (1000 * 60)) / 1000);
    const formatNumber = (value: number): string => String(Math.abs(value)).padStart(2, '0')
    return {
      status: isNow ? 'now' : (isPast ? 'past' : 'future'),
      diff,
      days,
      hours,
      minutes,
      seconds,
      strHours: formatNumber(hours),
      strMinutes: formatNumber(minutes),
      strSeconds: formatNumber(seconds)
    };
  }

  static diffWithNow(value: number): ITimestampDiff {
    return TimestampUtil.diff(value, new Date().valueOf());
  }
}
