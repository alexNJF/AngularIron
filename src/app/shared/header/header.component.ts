import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Dropdown } from 'bootstrap';
import { AppData } from '../../app.data';
import { Subject } from 'rxjs';
import { GroupBy, IBoot, ILanguage, IProductMenuItem, IUser } from '../../app.interface';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/service/auth.service';
import { environment } from '../../../environments/environment';
import { BsObject, BsObjectsService } from '../../core/service/bs-objects.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(
    private appData: AppData,
    private authService: AuthService,
    private bsObjectsService: BsObjectsService
  ) {
  }

  private readonly objectIdPrefix = 'MainHeader';
  private readonly dropdownIdPrefix = `${this.objectIdPrefix}-Dropdown`;

  isUserMenuOpen: boolean = false;
  @ViewChild('userMenuTrigger', {static: false})
  set _userMenu(element: ElementRef) {
    if (!element) return;
    const id = this.bsObjectsService.getId(this.dropdownIdPrefix, element.nativeElement);
    this.destroyDropdown(this.dropdownIdPrefix, id);
    const getRef = () => new Dropdown(element.nativeElement, {
      popperConfig: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -5]
            }
          }
        ]
      }
    });
    this.bsObjectsService.create(id, getRef);
    const parent = (element.nativeElement as HTMLElement).parentElement;
    parent?.addEventListener('show.bs.dropdown', () => this.isUserMenuOpen = true);
    parent?.addEventListener('hide.bs.dropdown', () => this.isUserMenuOpen = false);
  }

  isLanguageMenuOpen = false;
  @ViewChild('languageMenuTrigger', {static: true})
  set _languageMenu(element: ElementRef) {
    const id = this.bsObjectsService.getId(this.dropdownIdPrefix, element.nativeElement);
    this.destroyDropdown(this.dropdownIdPrefix, id);
    const getRef = () => new Dropdown(element.nativeElement, {
      popperConfig: {
        placement: 'bottom-start'
      }
    });
    this.bsObjectsService.create(id, getRef);
    const parent = (element.nativeElement as HTMLElement).parentElement;
    parent?.addEventListener('show.bs.dropdown', () => this.isLanguageMenuOpen = true);
    parent?.addEventListener('hide.bs.dropdown', () => this.isLanguageMenuOpen = false);
  }

  selectedLanguage: ILanguage | undefined;
  user: IUser | null = null;
  languages: ILanguage[] = [];
  cartItemsCount: number = 0;
  tel: string = '';

  products: GroupBy<IProductMenuItem> | undefined;
  productGroups: string[] = [];
  selectedProductGroup: string | undefined;

  isSearchSuggestionsVisible: boolean = false;
  isProductMenuVisible: boolean = false;

  private destroy = new Subject();

  ngOnInit(): void {
    this.appData.boot$.pipe(
      takeUntil(this.destroy)
    ).subscribe({
      next: (boot) => {
        if (boot === null) {
          return;
        }
        this.user = boot.user;
        this.selectedLanguage = boot.languages.find(w => w.id === boot.selectedLanguage);
        this.languages = boot.languages;
        this.cartItemsCount = boot.cartItemsCount;
        this.tel = boot.tel;
      }
    });
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

  goToDashboard(event: MouseEvent): void {
    event.preventDefault();
    if (environment.production) {
      window.location.replace('/dashboard');
      return;
    }
    window.location.replace('http://localhost:3000');
  }

  logout(event: MouseEvent): void {
    event.preventDefault();
    this.authService.logout();
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
