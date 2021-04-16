import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ISlide } from './slider.interface';
import { animateCss, AnimationSpeed } from '../../utils/AnimateCss';
import { LogUtil } from '../../utils/LogUtil';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, OnDestroy {

  private sliderInterval: number | undefined;
  currentIndex: number = -1;
  @Input()
  sliderWidth: string = '100%';
  @Input()
  sliderHeight: string = '400px';
  @Input()
  sliderMaxWidth: string | undefined;
  @Input()
  sliderMaxHeight: string | undefined;
  @Input()
  autoPlayEnable: boolean = true;
  @Input()
  autoPlaySpeed: number = 4000;
  @Input()
  animationEnable: boolean = true;
  @Input()
  animationSpeed: AnimationSpeed = 'faster';
  @Input()
  animationName: 'backIn' | 'bounceIn' | 'fadeIn' | 'lightSpeedIn' | 'zoomIn' | 'slideIn' = 'fadeIn';
  @Input()
  arrowsEnable: boolean = true;
  @Input()
  dotsIndicatorEnable: boolean = true;
  @Input()
  dotsIndicatorStyle: 'circle' | 'rectangle' = 'circle';
  @Input()
  slides: ISlide[] = [];

  private slideItems: QueryList<ElementRef> | undefined;
  @ViewChildren('slideItems')
  set _setSlideItems(value: QueryList<ElementRef>) {
    this.slideItems = value;
  }


  ngOnInit(): void {
    this.navigate('next');
    this.setSliderInterval();
  }

  ngOnDestroy(): void {
    this.clearSliderInterval();
  }

  private setSliderInterval(): void {
    if (this.autoPlayEnable) {
      this.sliderInterval = window.setInterval(() => this.navigate('next'), this.autoPlaySpeed);
    }
  }

  private clearSliderInterval(): void {
    if (this.autoPlayEnable) {
      window.clearInterval(this.sliderInterval);
    }
  }

  private getNextIndex(): number {
    if (this.currentIndex === -1 || (this.currentIndex + 1) === this.slides.length) return 0;
    return this.currentIndex + 1;
  }

  private getPreviousIndex(): number {
    if (this.currentIndex === -1 || (this.currentIndex - 1) < 0) {
      const length = this.slides.length;
      return length > 0 ? (length - 1) : 0;
    }
    return this.currentIndex - 1;
  }

  private next(): void {
    this.setCurrentIndex(this.getNextIndex());
  }

  private previous(): void {
    this.setCurrentIndex(this.getPreviousIndex());
  }

  private setCurrentIndex(index: number): void {
    if (index === this.currentIndex) {
      LogUtil.w(`SliderComponent: setCurrentIndex: IGNORE (SAME INDEX)`);
      return;
    }
    const element: HTMLElement | undefined = this.slideItems?.find((item, i) => index === i)?.nativeElement;
    if (element && this.animationEnable) {
      const animation = index > this.currentIndex ? `${this.animationName}Right` : `${this.animationName}Left`;
      animateCss(element, animation, this.animationSpeed);
    }
    this.currentIndex = index;
  }

  onSlideLoad(index: number): void {
    this.slides[index].loaded = true;
    const element: HTMLElement | undefined = this.slideItems?.get(index)?.nativeElement;
    if (!element) return;
    element.classList.remove('zero-opacity');
    animateCss(element, `${this.animationName}Right`, this.animationSpeed);
  }

  navigate(method: 'next' | 'prev' | 'index', userClick: boolean = false, index: number = -1): void {
    const handle = () => {
      switch (method) {
        case 'next':
          this.next();
          break;
        case 'prev':
          this.previous();
          break;
        case 'index':
          this.setCurrentIndex(index);
          break;
      }
    };
    if (userClick) this.clearSliderInterval();
    handle();
    if (userClick) this.setSliderInterval();
  }

}
