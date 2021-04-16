import { ISubProductFilters } from './sub-product-table/sub-product-table.interface';
import { IProductMenuItem } from '../../app.interface';

export interface IProductAbout {
  key: string;
  value: string;
}

export interface IProductAboutGroup {
  title: string;
  items: IProductAbout[];
}

export interface IProductResolve {
  product: IProduct;
  products: IProductMenuItem[];
  filters: Partial<ISubProductFilters>;
}

export interface IProduct {
  id: number;
  name: string;
  image: string;
  catalog: string;
  video: string;
  about: IProductAboutGroup[];
  calculatorType: string;
}
