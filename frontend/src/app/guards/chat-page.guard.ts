import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthenticationService } from "../login/authentication.service";

@Injectable({
  providedIn: "root",
})
export class ChatPageGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isConnected()) {
      return true;
    } else {
      this.router.navigate(["/"]); // Utilisez navigate au lieu de parseUrl pour naviguer vers la page d'accueil
      return false;
    }
  }
}
