import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IBreadcrumb } from '../../shared/breadcrumb/breadcrumb.interface';
import { BsObject, BsObjectsService } from '../../core/service/bs-objects.service';
import { ActivatedRoute, Data, ParamMap } from '@angular/router';
import { IdWithType, ISubProductFilters } from '../product/sub-product-table/sub-product-table.interface';
import { IShop, IShopResolve } from './shop.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LogUtil } from '../../utils/LogUtil';
import { ScrollService } from '../../core/service/scroll.service';
import { ISlide } from '../../shared/slider/slider.interface';
import { MapService } from '../../map/map.service';
import { Map, MapOptions, Marker } from 'mapbox-gl';
declare var Packery: any;

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {

  constructor(
    private mapService: MapService,
    private scrollService: ScrollService,
    private bsObjectsService: BsObjectsService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  private readonly objectIdPrefix = 'ShopMainPage';
  private readonly mapIdPrefix = `${this.objectIdPrefix}-Map`;

  shopId: IdWithType | undefined;
  shop: IShop | undefined;
  filters: Partial<ISubProductFilters> | undefined;

  breadcrumbItems: IBreadcrumb[] = [];
  aboutSlides: ISlide[] = [];

  readonly aboutTab = 'aboutTab';
  readonly certsTab = 'certsTab';
  readonly catalogTab = 'catalogTab';
  readonly videoTab = 'videoTab';
  activeTab = this.aboutTab;

  readonly mainAddressTab = 'mainAddressTab';
  readonly officeAddressTab = 'officeAddressTab';
  activeAddressTab = this.mainAddressTab;

  readonly subProductsTab = 'subProductsTab';
  readonly stockExchangeTab = 'stockExchangeTab';
  readonly commentsTab = 'commentsTab';
  activeContentTab = this.subProductsTab;

  @ViewChild('addressLocationMap', {static: true})
  addressLocationMap: ElementRef | undefined;

  aboutGrid: any | undefined;
  @ViewChild('aboutGrid', {static: false})
  set _aboutGrid(value: ElementRef) {
    if (!value) return;
    if (this.aboutGrid) this.aboutGrid.destroy();
    this.aboutGrid = new Packery(value.nativeElement, {
      itemSelector: '.grid-item.shop-about-col',
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
        if (this.shopId?.value === id) return;
        this.shopId = {value: id, type: 'shop'};
        LogUtil.i(`Navigated: Shop: ${id}`);
      }
    });
    this.activatedRoute.data.pipe(
      takeUntil(this.destroy)
    ).subscribe({
      next: (res: Data) => {
        const data: IShopResolve = res.data;
        LogUtil.i(`ShopComponent resolved data`, data);
        this.shop = data.shop;
        this.aboutSlides = (this.shop?.images || []).map((image: string) => {
          return {
            src: image
          };
        });
        this.filters = data.filters;
        this.setBreadcrumbItems();
        this.changeAddressTab(this.activeAddressTab);
        this.scrollService.top();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.destroyMap();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.aboutGrid) this.aboutGrid.reloadItems();
  }

  setBreadcrumbItems(): void {
    this.breadcrumbItems = [
      {
        title: 'تولید کنندگان',
        onClick: (event: MouseEvent) => event.preventDefault()
      },
      {
        title: this.shop?.name,
        routerLink: `/shop/${this.shop?.id}`
      }
    ];
  }

  setupMap(longitude: number, latitude: number, zoom: number): void {
    (this.addressLocationMap?.nativeElement as Element)?.classList?.remove('d-none');
    const id = this.bsObjectsService.getId(this.mapIdPrefix, this.addressLocationMap?.nativeElement);
    const getRef = () => {
      const mapOptions: Partial<MapOptions> = {
        container: this.addressLocationMap,
        center: [longitude, latitude],
        zoom
      };
      return this.mapService.make(mapOptions)
        .then((map: Map): Map => {
          const marker: Marker = this.mapService.createMarker(longitude, latitude);
          marker.addTo(map);
          return map;
        });
    };
    this.bsObjectsService.create(id, getRef);
  }

  private destroyMap(): void {
    (this.addressLocationMap?.nativeElement as Element)?.classList?.add('d-none');
    const id = this.bsObjectsService.getId(this.mapIdPrefix, this.addressLocationMap?.nativeElement);
    const map = this.bsObjectsService.find(id);
    if (map) this.bsObjectsService.destroy(this.mapIdPrefix, id, (object: BsObject) => {
      object.ref.then((ref: Map) => ref.remove());
    });
  }

  changeActiveTab(name: string): void {
    this.activeTab = name;
  }

  changeAddressTab(name: string): void {
    this.activeAddressTab = name;
    if (!this.shop) return;
    this.shop.selectedAddress = this.activeAddressTab === 'mainAddressTab' ? this.shop.address : this.shop.officeAddress;
    const selected = this.shop.selectedAddress;
    this.destroyMap();
    if (typeof selected.longitude === 'number' && typeof selected.latitude === 'number') {
      this.setupMap(selected.longitude, selected.latitude, 15);
    }
  }

  changeContentTab(name: string): void {
    this.activeContentTab = name;
  }

}
