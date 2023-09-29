import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserCredentials } from "./model/user-credentials";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  static KEY = "username";

  private username = new BehaviorSubject<string | null>(null);

  constructor(){
    localStorage.getItem(AuthenticationService.KEY);
  }
  

  login(userCredentials: UserCredentials) {
    console.log()
    localStorage.setItem(AuthenticationService.KEY,userCredentials.username);
    this.username.next(localStorage.getItem(AuthenticationService.KEY));
  }

  logout() {
    localStorage.clear();
  }

  getUsername(): Observable<string | null> {
    return this.username.asObservable();
  }
}
