import { ShopType } from '../../shop/shop.interface';

export interface IdWithType {
  value: string;
  type: 'product' | 'shop';
}

export interface IShopCity {
  id: number;
  name: string;
  type: ShopType;
}

export interface IShopProduct {
  id: number;
  name: string;
}

export interface ISubProductBrand {
  id: number;
  name: string;
}

export interface ISubProductAttribute {
  productId: number;
  id: number;
  name?: string;
  values: string[];
}

export interface ISubProductFilters {
  shops: IShopCity[];
  products: IShopProduct[];
  brands: ISubProductBrand[];
  attributes: ISubProductAttribute[];
  groupedCities: GroupBy<IShopCity>;
  types: string[];
}

export interface ISubProductFiltersPayload {
  type: ShopType;
  cityId: number;
  productId: number;
  brands: number[];
  attributes: ISubProductAttribute[];
}

export interface ISubProductUnit {
  id: number;
  name: string;
  baseWeight: number;
  helperText: string;
  minOrder: number;
  maxOrder: number;
}

export interface ISubProduct {
  id: number;
  brand: {name: string, image: string};
  length: number;
  size: number;
  name: string;
  code: string;
  units: ISubProductUnit[];
  basePrice: number;
  isInBasket: boolean;
  isFav: boolean;
  selectedUnit?: ISubProductUnit;
  totalPrice?: number;
}
