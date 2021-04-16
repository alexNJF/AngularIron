import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[lazySvg]'
})
export class SvgDirective implements AfterViewInit {

  constructor(
    private elementRef: ElementRef
  ) {
  }

  @Input('lazySvg')
  name: string = '';

  ngAfterViewInit(): void {
    let worker: Worker | null = new Worker('./../worker/svg.worker', {
      type: 'module'
    });
    worker?.postMessage(`/assets/icons/${this.name}.svg`);
    // @ts-ignore
    worker?.onmessage = (event: MessageEvent) => {
      this.elementRef.nativeElement.innerHTML = event.data;
      worker?.terminate();
      worker = null;
    };
  }

}
