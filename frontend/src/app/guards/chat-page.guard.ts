import { inject } from "@angular/core";
import { CanDeactivateFn, Router } from "@angular/router";
import { AuthenticationService } from "../login/authentication.service";

export const chatPageGuard: CanDeactivateFn<unknown> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (inject(AuthenticationService).isConnected()) {
    return true;
  } else {
    return inject(Router).parseUrl("/");
  }
};
