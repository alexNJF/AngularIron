export interface IBaseResponse<T> {
  success: boolean;
  message: string;
  showMessage: boolean;
  data: T;
}

export interface IVerifiable {
  value: string;
  verified: boolean;
  mustVerify: boolean;
}

export interface IUser {
  name: string;
  avatar?: string;
  mobile: IVerifiable;
  email: IVerifiable;
  roles: string[];
}

export interface ILanguage {
  id: number;
  name: string;
  code: string;
  direction: 'rtl' | 'ltr';
  default: boolean;
}

export interface IProductMenuItem {
  id: number;
  name: string;
  icon: string;
  menuGroup?: string;
  isMenuOpen?: boolean;
}

export interface IBoot {
  appName: string;
  selectedLanguage: number;
  languages: ILanguage[];
  products: IProductMenuItem[];
  cartItemsCount: number;
  tel: string;
  user: IUser | null;
}

export interface GroupBy<T> {
  [key: string]: T[];
}

export interface IProvince {
  id: number;
  name: string;
  cites?: ICity[];
}

export interface ICity {
  id: number;
  provinceId: number;
  name: string;
}

export interface IPagination<T = any> {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
  items: T;
}

export interface IPaginationUI {
  currentPage: number;
  lastPage: number;
  totalItems: number;
  prev: boolean;
  next: boolean;
  pages: number[];
}

export interface ITimestampDiff {
  status: 'past' | 'now' | 'future';
  diff: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  strHours: string;
  strMinutes: string;
  strSeconds: string;
}
