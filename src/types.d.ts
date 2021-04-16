interface GroupBy<T> {
  [key: string]: T[];
}

declare interface String {
  ucFirst(): string;
}

declare interface Array<T> {
  groupBy(key: string): GroupBy<T>;
}
