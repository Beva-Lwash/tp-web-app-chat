import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { UserCredentials } from "../model/user-credentials";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.css"],
})
export class LoginFormComponent implements OnInit {
  loginForm = this.fb.group({
    username: "",
    password: "",
  });

  @Output()
  login = new EventEmitter<UserCredentials>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  user: UserCredentials={
    username:this.loginForm.value.username! as string,
    password:this.loginForm.value.password! as string,
  };

  onLogin() {
    this.login.emit(this.user);
    console.log(this.user.username);
    console.log(this.user.password);
  }
}
