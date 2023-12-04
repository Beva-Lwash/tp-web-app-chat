import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { TestHelper } from "src/app/test/test-helper";

import { LoginFormComponent } from "./login-form.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("LoginFormComponent", () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let testHelper: TestHelper<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    testHelper = new TestHelper(fixture);
    fixture.detectChanges();
  });

  function writeUsername(username: string) {
    console.log(fixture.debugElement.nativeElement);

    const usernameInput = testHelper.getInput('username-input');
    testHelper.writeInInput(usernameInput, username);
  }

  function writePassword(password: string) {
    console.log(fixture.debugElement.nativeElement);

    const passwordInput = testHelper.getInput('password-input');
    testHelper.writeInInput(passwordInput, password);
  }

  function clickLoginButton() {
    const button = testHelper.getButton('login-button');
    button.click();
  }  
 
 it('should emit username and password', () => {
   let username: string;
   let password: string;
 
   // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
   component.login.subscribe((event) => {
     username = event.username;
     password = event.password;
   });
 
   // À compléter
   writeUsername('username');
   writePassword('password');
   clickLoginButton();

   expect(username!).toBe('username');
   expect(password!).toBe('password');
   expect(component.loginForm.valid).toBe(true);
 });

 it('should not emit if username is empty', () => {
  let username: string;
  let password: string;

  component.login.subscribe((event) => {
    username = event.username;
    password = event.password;
  });

  writePassword('password');

  clickLoginButton();

  expect(username!).toBeUndefined();
  expect(password!).toBeUndefined();
  expect(component.loginForm.valid).toBe(false);
});

it('should not emit if password is empty', () => {
  let username: string;
  let password: string;

  component.login.subscribe((event) => {
    username = event.username;
    password = event.password;
  });

  writeUsername('username');

  clickLoginButton();

  expect(username!).toBeUndefined();
  expect(password!).toBeUndefined();
  expect(component.loginForm.valid).toBe(false);
});


 it('should not emit if username and password are both empty', () => {
  let username: string;
  let password: string;

  component.login.subscribe((event) => {
    username = event.username;
    password = event.password;
  });

  clickLoginButton();

  expect(username!).toBeUndefined();
  expect(password!).toBeUndefined();
  expect(component.loginForm.valid).toBe(false);
});

it('should show error message if username is missing', () => {
  writePassword('password');
  clickLoginButton();
  fixture.detectChanges();
  const errorMessage = testHelper.getElement('error-message');
  expect(errorMessage).toBeDefined();
});

it('should show error message if password is missing', () => {
  writeUsername('username');
  clickLoginButton();
  fixture.detectChanges();
  const errorMessage = testHelper.getElement('error-message');
  expect(errorMessage).toBeDefined();
});

it('should not show error message if username and password are present', () => {
  writeUsername('username');
  writePassword('password');
  clickLoginButton();
  fixture.detectChanges();
  const errorMessage = testHelper.getElement('error-message');
  expect(errorMessage).toBeUndefined();
});

it('should show error message is username and password are both empty', () => {
  clickLoginButton();
  fixture.detectChanges();
  const errorMessage = testHelper.getElement('error-message');
  expect(errorMessage).toBeDefined();
});

});
