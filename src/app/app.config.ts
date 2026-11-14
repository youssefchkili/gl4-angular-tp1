import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from "@angular/core";
import { provideRouter, withPreloading } from "@angular/router";
import { provideHttpClient, withXhr, withInterceptorsFromDi } from "@angular/common/http";
import { provideServiceWorker } from "@angular/service-worker";
import { provideToastr } from "ngx-toastr";

import { routes } from "./app.routes";
import { AuthInterceptorProvider } from "./auth/interceptors/auth.interceptor";
import { SelectivePreloadingStrategy } from "./routing/selective-preloading.strategy";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes, withPreloading(SelectivePreloadingStrategy)),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    AuthInterceptorProvider,
    provideToastr(),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
};