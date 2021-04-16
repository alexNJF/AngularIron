import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IProduct, IProductResolve } from './product.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LogUtil } from '../../utils/LogUtil';
import { IBreadcrumb } from '../../shared/breadcrumb/breadcrumb.interface';
import { Dropdown } from 'bootstrap';
import { GroupBy, IBoot, IProductMenuItem } from '../../app.interface';
import { ScrollService } from '../../core/service/scroll.service';
import { Options as PopperOptions } from '@popperjs/core';
import { ProductService } from './product.service';
import { ISubProductFilters, IdWithType } from './sub-product-table/sub-product-table.interface';
import { BsObject, BsObjectsService } from '../../core/service/bs-objects.service';
import { AppData } from '../../app.data';
declare var Packery: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  constructor(
    private appData: AppData,
    private productService: ProductService,
    private elementRef: ElementRef,
    private scrollService: ScrollService,
    private bsObjectsService: BsObjectsService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  private readonly objectIdPrefix = 'ProductMainPage';
  private readonly dropdownIdPrefix = `${this.objectIdPrefix}-Dropdown`;

  product: IProduct | undefined;
  productId: IdWithType | undefined;
  filters: Partial<ISubProductFilters> | undefined;

  menu: GroupBy<IProductMenuItem> | undefined;
  menuGroups: string[] = [];
  menuBreakPoint: MediaQueryList = window.matchMedia('(min-width: 992px)');

  breadcrumbItems: IBreadcrumb[] = [];
  readonly aboutTab = 'aboutTab';
  readonly catalogTab = 'catalogTab';
  readonly weightCalTab = 'weightCalcTab';
  readonly videoTab = 'videoTab';
  activeTab = this.aboutTab;

  @ViewChildren('productMenuTrigger')
  set _productMenu(triggers: QueryList<ElementRef>) {
    this.destroyDropdown(this.dropdownIdPrefix);
    triggers.forEach((trigger: ElementRef) => {
      const id = this.bsObjectsService.getId(this.dropdownIdPrefix, trigger.nativeElement);
      const getRef = () => this.createMenuDropdown(trigger);
      this.bsObjectsService.create(id, getRef, {trigger});
    });
  }

  aboutGrid: any | undefined;
  @ViewChild('aboutGrid', {static: false})
  set _aboutGrid(value: ElementRef) {
    if (!value) return;
    if (this.aboutGrid) this.aboutGrid.destroy();
    this.aboutGrid = new Packery(value.nativeElement, {
      itemSelector: '.grid-item.product-about-col',
      percentPosition: true,
      gutter: 15,
      originLeft: false
    });
  }

  private destroy = new Subject();

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      takeUntil(this.destroy)
    ).subscribe({
      next: (params: ParamMap) => {
        const id = params.get('id') || '0';
        if (this.productId?.value === id) return;
        this.productId = {value: id, type: 'product'};
        LogUtil.i(`Navigated: Product: ${id}`);
      }
    });
    this.activatedRoute.data.pipe(
      takeUntil(this.destroy)
    ).subscribe({
      next: (res) => {
        const data: IProductResolve = res.data;
        LogUtil.i(`ProductComponent resolved data`, data);
        this.product = data.product;
        this.filters = data.filters;
        this.setBreadcrumbItems();
        this.scrollService.top();
      }
    });
    this.appData.boot$.pipe(
      takeUntil(this.destroy)
    ).subscribe({
      next: (boot: IBoot | null) => {
        if (!boot) return;
        this.menu = boot.products.groupBy('menuGroup');
        this.menuGroups = Object.keys(this.menu);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    if (this.aboutGrid) this.aboutGrid.destroy();
    this.destroyDropdown(this.dropdownIdPrefix);
  }

  @HostListener('window:resize')
  onResize() {
    this.bsObjectsService.scope(this.dropdownIdPrefix)
      .forEach((object: BsObject) => {
        const trigger: ElementRef = object.data.trigger;
        const id: string = object.id;
        const getRef = () => this.createMenuDropdown(trigger);
        (object.ref as Dropdown).hide();
        this.destroyDropdown(this.dropdownIdPrefix, object.id);
        this.bsObjectsService.create(id, getRef, {trigger});
      });
    if (this.aboutGrid) this.aboutGrid.reloadItems();
  }

  setBreadcrumbItems(): void {
    this.breadcrumbItems = [
      {
        title: 'محصولات',
        onClick: (event) => event.preventDefault()
      },
      {
        title: this.product?.name,
        routerLink: `/product/${this.product?.id}`
      }
    ];
  }

  private createMenuDropdown(trigger: ElementRef): Dropdown {
    const placement = this.menuBreakPoint.matches ? 'left' : 'bottom-end';
    const distance = this.menuBreakPoint.matches ? 15 : 0;
    const skidding = 0;
    const popperConfig: Partial<PopperOptions> = {
      placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [skidding, distance]
          }
        }
      ]
    };
    return new Dropdown(trigger.nativeElement, {
      popperConfig
    });
  }

  changeActiveTab(name: string): void {
    this.activeTab = name;
  }

  hoverDropdown(event: Event, container: HTMLElement): void {
    this.bsObjectsService.hoverDropdown(event, this.dropdownIdPrefix, container);
  }

  private destroyDropdown(prefix: string, id: string | null = null): void {
    this.bsObjectsService.destroy(prefix, id, (dropdown: BsObject) => {
      (dropdown.ref as Dropdown).hide();
      (dropdown.ref as Dropdown).dispose();
    });
  }

}
