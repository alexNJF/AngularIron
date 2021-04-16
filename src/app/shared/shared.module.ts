import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SvgDirective } from './directive/svg.directive';
import { RouterModule } from '@angular/router';
import { HasRoleDirective } from './directive/has-role.directive';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FormatNumberPipe } from './pipe/format-number.pipe';
import { BrPipe } from './pipe/br.pipe';
import { SliderComponent } from './slider/slider.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SquareSizeDirective } from './directive/square-size.directive';
import { ShopTypePipe } from './pipe/shop-type.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SvgDirective,
    HasRoleDirective,
    BreadcrumbComponent,
    FormatNumberPipe,
    BrPipe,
    ShopTypePipe,
    SliderComponent,
    SpinnerComponent,
    SquareSizeDirective
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SvgDirective,
    HasRoleDirective,
    BreadcrumbComponent,
    FormatNumberPipe,
    BrPipe,
    ShopTypePipe,
    SliderComponent,
    SquareSizeDirective
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
