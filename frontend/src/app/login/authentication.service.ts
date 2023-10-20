import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, firstValueFrom } from "rxjs";
import { UserCredentials } from "./model/user-credentials";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { LoginResponse } from "./model/LoginResponse";



@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  static KEY = "username";

  private username = new BehaviorSubject<string | null>(null);


  constructor(private router: Router, private httpClient: HttpClient){
    this.username.next(localStorage.getItem(AuthenticationService.KEY));
    this.httpClient=httpClient;
  }
  

  async login(userCredentials: UserCredentials) {
    await firstValueFrom(
      this.httpClient.post<LoginResponse>(`${environment.backendUrl}/auth/login`, userCredentials,
    { withCredentials: true }
    ))
    ;
    const {username} = userCredentials;
    localStorage.setItem(AuthenticationService.KEY, username);
    this.username.next(username);
    this.router.navigate(["/chat"]);
  }

  async logout() {
    await firstValueFrom(
      this.httpClient.post<LoginResponse>(`${environment.backendUrl}/auth/logout`,null,
    { withCredentials: true }
    ))
    ;
    localStorage.removeItem(AuthenticationService.KEY);
    this.username.next(null);
  }

  getUsername(): Observable<string | null> {
    return this.username.asObservable();
  }


}
