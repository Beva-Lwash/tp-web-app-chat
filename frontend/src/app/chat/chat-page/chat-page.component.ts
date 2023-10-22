import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthenticationService } from "src/app/login/authentication.service";
import { Message } from "../message.model";
import { MessagesService } from "../messages.service";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-chat-page",
  templateUrl: "./chat-page.component.html",
  styleUrls: ["./chat-page.component.css"],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  messages$ = this.messagesService.getMessages();
  username$ = this.authenticationService.getUsername();

  messageForm = this.fb.group({
    msg: "",
  });

  username: string | null = null;
  usernameSubscription: Subscription;

  //A faire
  messages: Message[] | null = [];
  messagesSubscription: Subscription;
  

  constructor(
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.usernameSubscription = this.username$.subscribe((u) => {
      this.username = u;  
    if (this.username == '') 
      this.router.navigate(['']);
    });
    
    this.messagesSubscription = this.messages$.subscribe((m) => {
      this.messages = m;
    
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    } 
    if(this.messagesSubscription)
      this.messagesSubscription.unsubscribe();
  }
  onPublishMessage(msg: string) {
    if (this.username && msg) {
      this.messagesService.postMessage({
        text: msg,
        username: this.username,
        timestamp: Date.now(),
      });
    }
  }
  onLogout() {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }
}
