import { ISubProductFilters } from '../product/sub-product-table/sub-product-table.interface';

export enum ShopEnum {
  TYPE_REPO=  'repo',
  TYPE_FACTORY = 'factory'
}

export type ShopType = ShopEnum.TYPE_REPO | ShopEnum.TYPE_FACTORY;

export interface IShopAddress {
  text: string;
  telephone: string;
  fax: string;
  latitude: number;
  longitude: number;
}

export interface IShopAbout {
  key: string;
  value: string;
}

export interface IShop {
  type: ShopType;
  id: number;
  name: string;
  image?: string;
  website?: string;
  email?: string;
  about: IShopAbout[];
  images: string[];
  certs: string[];
  catalog?: string;
  video?: string;
  address: Partial<IShopAddress>;
  officeAddress: Partial<IShopAddress>;
  selectedAddress?: Partial<IShopAddress>;
}

export interface IShopResolve {
  shop: IShop;
  filters: Partial<ISubProductFilters>;
}
