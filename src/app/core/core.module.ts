import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpClientConfigInterceptor } from './interceptor/http-client-config.interceptor';
import { HandleUnauthorizedInterceptor } from './interceptor/handle-unauthorized.interceptor';
import { BootResolver } from './resolver/boot.resolver';
import { AuthService } from './service/auth.service';
import { BsObjectsService } from './service/bs-objects.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientConfigInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HandleUnauthorizedInterceptor,
      multi: true
    },
    BootResolver,
    AuthService,
    BsObjectsService
  ]
})
export class CoreModule {
}
