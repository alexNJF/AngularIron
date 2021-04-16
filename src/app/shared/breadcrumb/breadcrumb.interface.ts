export interface IBreadcrumb {
  title: string | undefined | null;
  routerLink?: string | undefined | null;
  onClick?: (event: MouseEvent) => void;
}
