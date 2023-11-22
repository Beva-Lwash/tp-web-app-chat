import { Component, OnInit } from "@angular/core";
import { UserCredentials } from "../model/user-credentials";
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async onLogin(userCredentials: UserCredentials) {
    try {
      await this.authenticationService.login(userCredentials);
    } catch (e) {
      if (e instanceof HttpErrorResponse && e.status == 403) {
        e.error("Mot de passe Invalide");
        console.error("mdp invalide", e.message);
      } else {
        e = new Error("Problème de connexion");
      }
    }
    this.router.navigate(["/chat"]);
  }
}
