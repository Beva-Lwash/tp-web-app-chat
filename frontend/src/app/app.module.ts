import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginPageComponent } from "./login/login-page/login-page.component";
import { LoginFormComponent } from "./login/login-form/login-form.component";
import { ChatPageComponent } from "./chat/chat-page/chat-page.component";
import { NewMessageFormComponent } from './chat/new-message-form/new-message-form.component';
import { MessageListComponent } from './chat/message-list/message-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'; 
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule }from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoginFormComponent,
    ChatPageComponent,
    NewMessageFormComponent,
    MessageListComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, BrowserAnimationsModule, MatButtonModule
  ,MatFormFieldModule, MatIconModule, MatInputModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
