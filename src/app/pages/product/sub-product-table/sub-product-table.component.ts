import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { IPaginationUI } from '../../../app.interface';
import { LogUtil } from '../../../utils/LogUtil';
import { PaginationUtil } from '../../../utils/PaginationUtil';
import { Dropdown, Tooltip } from 'bootstrap';
import {
  ISubProductFilters,
  ISubProductFiltersPayload,
  IdWithType,
  ISubProduct,
  ISubProductAttribute,
  IShopCity, ISubProductUnit, IShopProduct
} from './sub-product-table.interface';
import { SubProductTableService } from './sub-product-table.service';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { PartialObserver, Subscription } from 'rxjs';
import { BsObjectsService, BsObject } from '../../../core/service/bs-objects.service';

@Component({
  selector: 'sub-product-table',
  templateUrl: './sub-product-table.component.html',
  styleUrls: ['./sub-product-table.component.scss']
})
export class SubProductTableComponent implements OnInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private subProductTableService: SubProductTableService,
    private bsObjectsService: BsObjectsService
  ) {
  }

  private readonly objectIdPrefix = 'SubProductTable';
  private readonly dropdownIdPrefix = `${this.objectIdPrefix}-Dropdown`;
  private readonly tooltipIdPrefix = `${this.objectIdPrefix}-Tooltip`;

  id: IdWithType | undefined;
  filters: Partial<ISubProductFilters> | undefined;

  selectedShop: IShopCity | undefined;
  selectedProduct: IShopProduct | undefined;

  scrollIntoView = false;
  filtersContainer: HTMLElement | undefined;

  filtersForm = this.formBuilder.group({
    brands: this.formBuilder.array([]),
    attributes: this.formBuilder.array([])
  });

  attributes: ISubProductAttribute[] = [];
  subProductFiltersPayload: Partial<ISubProductFiltersPayload> | undefined;
  subProducts: ISubProduct[] = [];
  paginationUI: IPaginationUI | undefined;

  subProductsSub: Subscription | undefined;
  brandsSub: Subscription | undefined;
  attributesSub: Subscription | undefined;

  @Input('input')
  set _input(value: Partial<{id: IdWithType, filters: Partial<ISubProductFilters>}>) {
    LogUtil.i('SubProductTableComponent: set _input');
    this.id = value.id;
    this.filters = value.filters;
    this.scrollIntoView = false;

    let productId: number | undefined = undefined;
    this.selectedShop = undefined;
    this.selectedProduct = undefined;

    if (this.id?.type === 'product') {
      productId = Number(this.id.value);
      if (this.filters?.shops?.length) {
        this.selectedShop = this.filters.shops[0];
        this.filters.groupedCities = this.filters.shops.groupBy('type');
        this.filters.types = Object.keys(this.filters.groupedCities);
      }
    }

    if (this.id?.type === 'shop') {
      if (this.filters?.products?.length) {
        this.selectedProduct = this.filters.products[0];
        productId = this.selectedProduct.id;
      }
    }

    if (productId && this.filters?.attributes?.length) {
      this.filters.attributes = this.filters.attributes.filter(w => w.productId === productId);
    }

    this.removeFilters();
  }

  @ViewChild('filtersContainer', {static: true})
  set _filtersContainer(value: ElementRef) {
    this.filtersContainer = value.nativeElement;
  }

  @ViewChild('scrollTarget', {static: true})
  scrollTarget: ElementRef | undefined;

  @ViewChild('tableContainer', {static: true})
  tableContainer: ElementRef | undefined;

  @ViewChildren('dropdownTrigger')
  set _dropdown(triggers: QueryList<ElementRef>) {
    this.destroyDropdown(this.dropdownIdPrefix);
    triggers.forEach((trigger: ElementRef) => {
      const id = this.bsObjectsService.getId(this.dropdownIdPrefix, trigger.nativeElement);
      this.bsObjectsService.create(id, () => new Dropdown(trigger.nativeElement));

      const toggleAction = (trigger.nativeElement as HTMLElement).getAttribute('data-toggle-action');
      const dropIcon = (trigger?.nativeElement as HTMLElement).querySelector('.icon.drop');
      const parent = (trigger.nativeElement as HTMLElement).parentElement;
      if (parent?.getAttribute('data-has-event') === 'false') {
        parent?.addEventListener('show.bs.dropdown', () => {
          if (toggleAction === 'tableContainerToggleMinHeight') this.tableContainerToggleMinHeight('add');
          dropIcon?.classList?.add('open');
        });
        parent?.addEventListener('hide.bs.dropdown', () => {
          if (toggleAction === 'tableContainerToggleMinHeight') this.tableContainerToggleMinHeight('remove');
          dropIcon?.classList?.remove('open');
        });
        parent?.setAttribute('data-has-event', 'true');
      }
    });
  }

  @ViewChildren('tooltipTrigger')
  set _tooltip(triggers: QueryList<ElementRef>) {
    this.destroyTooltip(this.tooltipIdPrefix);
    triggers.forEach((trigger: ElementRef) => {
      const id = this.bsObjectsService.getId(this.tooltipIdPrefix, trigger.nativeElement);
      this.bsObjectsService.create(id, () => new Tooltip(trigger.nativeElement, {
        trigger: 'manual'
      }));
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroyDropdown(this.dropdownIdPrefix);
    this.destroyTooltip(this.tooltipIdPrefix);
  }

  hoverUnitTextTooltip(event: Event, trigger: HTMLElement): void {
    this.bsObjectsService.hoverTooltip(event, this.tooltipIdPrefix, trigger, () => new Tooltip(trigger, {
      trigger: 'manual',
      html: true
    }));
  }

  scrollIntoContainer(): void {
    if (this.scrollIntoView) this.scrollTarget?.nativeElement?.scrollIntoView();
    else this.scrollIntoView = true;
  }

  getSubProducts(page: number = 1) {
    const id = (this.id || {value: '0', type: 'product'}) as IdWithType;
    const filters: Partial<ISubProductFiltersPayload> = this.subProductFiltersPayload || {};
    if (id.type === 'product' && this.selectedShop) {
      filters.cityId = this.selectedShop.id;
      filters.type = this.selectedShop.type;
    }
    if (id.type === 'shop' && this.selectedProduct) {
      filters.productId = this.selectedProduct.id;
    }
    this.subProductsSub?.unsubscribe();
    this.subProductsSub = this.subProductTableService.getSubProducts(id, filters, page).subscribe({
      next: (data) => {
        this.subProducts = data.items.map((subProduct: ISubProduct) => {
          subProduct.selectedUnit = subProduct.units[0];
          return subProduct;
        });
        this.paginationUI = PaginationUtil.getPaginationUi(data);
        setTimeout(() => {
          this.scrollIntoContainer();
        });
      }
    });
  }

  removeFilters() {
    this.resetPayloadFilters();
    this.checkPayloadFilters();
    this.getSubProducts();
  }

  resetPayloadFilters() {
    // Brands
    if (this.filters?.brands?.length) {
      const brands = this.filtersForm.get('brands') as FormArray;
      this.brandsSub?.unsubscribe();
      this.brandsSub = undefined;
      brands.clear();
      this.filters.brands.forEach(() => brands.push(new FormControl(false)));
      // @ts-ignore
      this.subProductFiltersPayload?.brands = [];
      this.brandsSub = brands.valueChanges.subscribe(this.handleBrandsValueChanges());
    }
    // Attributes
    if (this.filters?.attributes?.length) {
      const attributes = this.filtersForm.get('attributes') as FormArray;
      this.attributesSub?.unsubscribe();
      this.attributesSub = undefined;
      attributes.clear();
      this.filters.attributes.forEach((attr) => {
        const attribute = this.formBuilder.group({
          productId: attr.productId,
          id: attr.id,
          values: this.formBuilder.array([])
        });
        const attrValues = attribute.get('values') as FormArray;
        attr.values.forEach(() => attrValues.push(new FormControl(false)));
        attributes.push(attribute);
      });
      // @ts-ignore
      this.subProductFiltersPayload?.attributes = [];
      this.attributesSub = attributes.valueChanges.subscribe(this.handleAttributesValueChanges());
    }
    // Render template!
    this.filters = JSON.parse(JSON.stringify(this.filters));
  }

  setFilter(name: string, val: any) {
    if (!this.subProductFiltersPayload) {
      this.subProductFiltersPayload = {};
    }
    // @ts-ignore
    this.subProductFiltersPayload[name] = val;
    this.checkPayloadFilters();
    this.getSubProducts();
  }

  checkPayloadFilters(): void {
    if (
      !this.subProductFiltersPayload?.brands?.length &&
      !this.subProductFiltersPayload?.attributes?.length
    ) {
      this.subProductFiltersPayload = undefined;
      LogUtil.i('SubProducts: NO FILTERS!');
    }
  }

  onSelectedShopChange(event: Event, shop: IShopCity): void {
    if (!(event.target as HTMLInputElement).checked) return;
    this.selectedShop = shop;
    this.getSubProducts();
  }

  onSelectedProductChange(event: Event, product: IShopProduct): void {
    if (!(event.target as HTMLInputElement).checked) return;
    this.selectedProduct = product;
    this.getSubProducts();
  }

  handleBrandsValueChanges(): PartialObserver<any> {
    return {
      next: (values: boolean) => {
        // @ts-ignore
        const selectedBrands: number[] = values.map((value: boolean, index: number) => value ? this.filters.brands[index].id : 0)
          .filter((id: number) => !!id);
        LogUtil.i('Filter: Brands:', selectedBrands);
        this.setFilter('brands', selectedBrands);
      }
    };
  }

  handleAttributesValueChanges(): PartialObserver<any> {
    return {
      next: (attrs: {productId: number, id: number, values: boolean[]}[]) => {
        const selectedAttributes: ISubProductAttribute[] = attrs.map((attr, attrIndex: number) => {
          return {
            productId: attr.productId,
            id: attr.id,
            // @ts-ignore
            values: attr.values.map((value: boolean, valueIndex: number) => value ? this.filters?.attributes[attrIndex].values[valueIndex] : '')
              .filter((value) => !!value) as string[]
          };
        }).filter(((attr) => !!attr.values.length));
        LogUtil.i('Filter: Attributes:', selectedAttributes);
        this.setFilter('attributes', selectedAttributes);
      }
    };
  }

  calcWeightAndPrice(index: number, event: Event) {
    const numberInput: HTMLInputElement | null = event.target as HTMLInputElement;
    const weightInput: HTMLInputElement | undefined = (this.elementRef.nativeElement as Document)
      .querySelectorAll('.calculatedWeightReadOnlyInput')[index] as HTMLInputElement;
    const value = Number(numberInput?.value) || 0;
    const baseWeight = Number(this.subProducts[index].selectedUnit?.baseWeight) || 0;
    const basePrice = Number(this.subProducts[index].basePrice) || 0;

    let weightText = '';
    if (value && baseWeight) {
      const numVal = Math.abs(value) * Math.abs(baseWeight);
      weightText = String(parseInt(numVal.toString()));
    }
    weightInput.value = weightText;

    this.subProducts[index].totalPrice = undefined;
    if (value && baseWeight && basePrice) {
      this.subProducts[index].totalPrice = (Math.abs(value) * Math.abs(baseWeight)) * Math.abs(basePrice);
    }
  }

  onChangeUnit(index: number, unit: ISubProductUnit, numInput: HTMLInputElement, event: Event) {
    const radio: HTMLInputElement = event.target as HTMLInputElement;
    if (!radio.checked) return;
    this.subProducts[index].selectedUnit = unit;
    numInput.dispatchEvent(new CustomEvent('input'));
  }

  destroyDropdown(prefix: string, id: string | null = null): void {
    this.bsObjectsService.destroy(prefix, id, (dropdown: BsObject) => {
      (dropdown.ref as Dropdown).dispose();
    });
  }

  destroyTooltip(prefix: string, id: string | null = null): void {
    this.bsObjectsService.destroy(prefix, id, (tooltip: BsObject) => {
      (tooltip.ref as Tooltip).dispose();
    });
  }

  private tableContainerToggleMinHeight(action: 'add' | 'remove'): void {
    const targetClass = 'table-min-height';
    const element: HTMLElement = this.tableContainer?.nativeElement;
    if (action === 'add') element.classList.add(targetClass);
    else element.classList.remove(targetClass);
  }

}
