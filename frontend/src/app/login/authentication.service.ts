import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserCredentials } from "./model/user-credentials";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  static KEY = "username";

  private username = new BehaviorSubject<string | null>(null);

  constructor(private router: Router){
    this.username.next(localStorage.getItem(AuthenticationService.KEY));
  }
  

  login(userCredentials: UserCredentials) {
    const {username} = userCredentials;
    localStorage.setItem(AuthenticationService.KEY, username);
    this.username.next(username);
    this.router.navigate(["/chat"]);
  }

  logout() {
    localStorage.removeItem(AuthenticationService.KEY);
    this.username.next(null);
  }

  getUsername(): Observable<string | null> {
    return this.username.asObservable();
  }
}
