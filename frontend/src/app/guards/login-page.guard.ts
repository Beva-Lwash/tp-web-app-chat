import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationService } from "../login/authentication.service";

export const loginPageGuard: CanActivateFn = (route, state) => {
  if (inject(AuthenticationService).isConnected()) {
    return inject(Router).parseUrl("/chat");
  } else {
    return true;
  }
};
