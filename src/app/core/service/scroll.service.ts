import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  top(): void {
    this.scrollTo(0);
  }

  scrollTo(top: number): void {
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }

  scrollInto(element: HTMLElement): void {
    element.scrollIntoView({
      behavior: 'smooth'
    });
  }
}
