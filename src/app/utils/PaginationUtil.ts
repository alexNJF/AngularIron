import { IPagination, IPaginationUI } from '../app.interface';

export class PaginationUtil {
  static getPaginationUi(pagination: IPagination): IPaginationUI {
    // const current = pagination.currentPage;
    // const total = pagination.total <= 0 ? 1 : Math.ceil((pagination.total / pagination.perPage));
    const maxLinks = 4;
    const pages: Array<number[]> = [];
    let temp: number[] = [];
    const resetTemp = () => {
      if (temp.length) {
        pages.push([...temp]);
        temp = [];
      }
    };
    for (let i = 1 ; i <= pagination.lastPage ; i++) {
      if (temp.length === maxLinks) {
        resetTemp();
      }
      temp.push(i);
    }
    resetTemp();
    const links: number[] = pages.find(w => w.indexOf(pagination.currentPage) !== -1) || [];
    if (links.length < maxLinks) {
      const lastLink = links[links.length - 1];
      if (lastLink > maxLinks) {
        const diff = maxLinks - links.length;
        for (const _ of Array(diff)) {
          links.unshift(links[0] - 1);
        }
      }
    }
    return {
      currentPage: pagination.currentPage,
      lastPage: pagination.lastPage,
      totalItems: pagination.total,
      prev: pagination.currentPage > 1,
      next: pagination.currentPage < pagination.lastPage,
      pages: links
    };
  }
}
