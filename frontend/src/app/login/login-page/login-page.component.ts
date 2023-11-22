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

  errorPresent = false;
  errorMessage = "";

  ngOnInit(): void {
    this.errorPresent = false;
  }

  async onLogin(userCredentials: UserCredentials) {
    try {
      await this.authenticationService.login(userCredentials);
      this.router.navigate(["/chat"]);
    } catch (e) {
      this.errorPresent = true;
      if (e instanceof HttpErrorResponse && e.status == 403) {
        this.errorMessage = "Mot de pass invalide!";
        console.log(this.errorMessage);
      } else {
        e = new Error("Problème de connexion");
        if (e instanceof Error) {
          this.errorMessage = e.message;
          console.log(this.errorMessage);
        }
      }
    }
  }
}
