import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from './calculator.component';
import { SquareComponent } from './components/square/square.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BullionComponent } from './components/bullion/bullion.component';
import { SquareCansComponent } from './components/square-cans/square-cans.component';
import { RectangularCansComponent } from './components/rectangular-cans/rectangular-cans.component';
import { SeamedPipeComponent } from './components/seamed-pipe/seamed-pipe.component';
import { RibbedRebarComponent } from './components/ribbed-rebar/ribbed-rebar.component';
import { SimpleRebarComponent } from './components/simple-rebar/simple-rebar.component';
import { SheetComponent } from './components/sheet/sheet.component';
import { HEAComponent } from './components/hea/hea.component';
import { HEBComponent } from './components/heb/heb.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { IPEComponent } from './components/ipe/ipe.component';
import { IPNComponent } from './components/ipn/ipn.component';
import { GuttersComponent } from './components/gutters/gutters.component';
import { SparayComponent } from './components/sparay/sparay.component';
import { ENabshiComponent } from './components/enabshi/enabshi.component';
import { GNabshiComponent } from './components/gnabshi/gnabshi.component';
import { TwoDigitDecimaNumberDirective } from './directives/two-digit-decimal.directive';
@NgModule({
  declarations: [CalculatorComponent, SquareComponent, BullionComponent, SquareCansComponent, RectangularCansComponent, SeamedPipeComponent, RibbedRebarComponent, SimpleRebarComponent, SheetComponent, HEAComponent, HEBComponent, IPEComponent, IPNComponent, GuttersComponent, SparayComponent, ENabshiComponent, GNabshiComponent,TwoDigitDecimaNumberDirective],
  imports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports:[CalculatorComponent]

})
export class CalculatorModule {
}
