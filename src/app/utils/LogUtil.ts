import { environment } from '../../environments/environment';

export class LogUtil {
  static i(...args: any[]): void {
    if (!environment.production) {
      console.log(...args);
    }
  }

  static w(...args: any[]): void {
    if (!environment.production) {
      console.warn(...args);
    }
  }

  static e(...args: any[]): void {
    if (!environment.production) {
      console.error(...args);
    }
  }
}
