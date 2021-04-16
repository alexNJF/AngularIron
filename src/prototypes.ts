String.prototype.ucFirst = function (): string {
  return `${this.charAt(0).toUpperCase()}${this.slice(1)}`;
}

Array.prototype.groupBy = function (key: string) {
  const grouped: any = {};
  this.forEach((item) => {
    const keyValue = item[key] || '';
    if (!grouped[keyValue]) {
      grouped[keyValue] = [];
    }
    grouped[keyValue].push(item);
  });
  return grouped;
}
