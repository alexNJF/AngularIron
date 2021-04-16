import {
  ChangeDetectorRef,
  Component,
  ElementRef, OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Dropdown } from 'bootstrap';
import { ISlide } from '../../shared/slider/slider.interface';
import { ActivatedRoute } from '@angular/router';
import { GroupBy, IBoot, IProductMenuItem } from '../../app.interface';
import { BsObject, BsObjectsService } from '../../core/service/bs-objects.service';
import { AppData } from '../../app.data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private appData: AppData,
    private changeDetection: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private bsObjectsService: BsObjectsService
  ) {
  }

  private readonly objectIdPrefix = 'MainHomePage';
  private readonly dropdownIdPrefix = `${this.objectIdPrefix}-Dropdown`;

  @ViewChildren('productMenuTrigger')
  set _productMenu(value: QueryList<ElementRef>) {
    if (!value?.length) return;
    value.filter((trigger: ElementRef) => {
      return !!(trigger.nativeElement as HTMLElement).getAttribute('data-group');
    }).forEach((trigger: ElementRef) => {
      const group = (trigger.nativeElement as HTMLElement).getAttribute('data-group');
      const product: Partial<IProductMenuItem> = this.products && group ? this.products[group][0] : {};
      product.isMenuOpen = false;
      const parent = (trigger.nativeElement as HTMLElement).parentElement;
      const menu = parent?.querySelector('.dropdown-menu');
      if (!menu) return;
      const id = this.bsObjectsService.getId(this.dropdownIdPrefix, trigger.nativeElement);
      const getRef = () => new Dropdown(trigger.nativeElement, {
        popperConfig: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [-80, -40]
              }
            }
          ]
        }
      });
      this.destroyDropdown(this.dropdownIdPrefix, id);
      this.bsObjectsService.create(id, getRef);
      parent?.addEventListener('show.bs.dropdown', () => product.isMenuOpen = true);
      parent?.addEventListener('hide.bs.dropdown', () => product.isMenuOpen = false);
    });
    this.changeDetection.detectChanges();
  }

  products: GroupBy<IProductMenuItem> | undefined;
  productGroups: string[] = [];

  private destroy = new Subject();

  // TEMP
  sliderOneSlides: ISlide[] = [
    {
      src: 'assets/images/home/slider2-1.jpg'
    },
    {
      src: 'assets/images/home/slider2-2.jpg'
    },
    {
      src: 'assets/images/home/slider2-3.jpg'
    },
  ];
  sliderTwoSlides: ISlide[] = [
    {
      src: 'assets/images/home/slider-1.png'
    },
    {
      src: 'assets/images/home/slider-2.png'
    },
  ];

  ngOnInit(): void {
    this.setProducts();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.destroyDropdown(this.dropdownIdPrefix);
  }

  setProducts(): void {
    this.appData.boot$.pipe(
      takeUntil(this.destroy)
    ).subscribe({
      next: (boot: IBoot | null) => {
        if (!boot) return;
        const products: IProductMenuItem[] = boot.products;
        this.products = products.groupBy('menuGroup');
        this.productGroups = Object.keys(this.products);
      }
    });
  }

  hoverDropdown(event: Event, container: HTMLElement): void {
    this.bsObjectsService.hoverDropdown(event, this.dropdownIdPrefix, container);
  }

  private destroyDropdown(prefix: string, id: string | null = null): void {
    this.bsObjectsService.destroy(prefix, id, (dropdown: BsObject) => {
      (dropdown.ref as Dropdown).dispose();
    });
  }

}
