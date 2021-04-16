import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[squareSize]'
})
export class SquareSizeDirective implements AfterViewInit {

  constructor(
    private elementRef: ElementRef
  ) {
  }

  ngAfterViewInit(): void {
    this.setHeight();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.setHeight();
  }

  private setHeight(): void {
    const width = (this.elementRef.nativeElement as HTMLElement).clientWidth;
    (this.elementRef.nativeElement as HTMLElement).style.height = `${width}px`;
  }

}
