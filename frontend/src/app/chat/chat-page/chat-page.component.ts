import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable,Subscription } from "rxjs";
import { AuthenticationService } from "src/app/login/authentication.service";
import { Message } from "../message.model";
import { MessagesService } from "../messages.service";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { WebSocketEvent, WebSocketService } from "../../webSocketService";


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

  messages: Message[] | null = [];
  messagesSubscription: Subscription;

  notifications$: Observable<WebSocketEvent> | null = null;
  notificationsSubscription: Subscription | null = null;

  

  constructor(
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private webSocketService: WebSocketService
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

  ngOnInit(){
    this.notifications$ = this.webSocketService.connect();
    this.notificationsSubscription = this.notifications$.subscribe(() => {
      this.messagesService.fetchMessages();
    });
    this.messagesService.fetchMessages();

  }

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    } 
    if(this.messagesSubscription)
      this.messagesSubscription.unsubscribe();
    
      this.webSocketService.disconnect();
  }
  
  async onPublishMessage(msg: string) {
    if (this.username && msg) {
      await this.messagesService.postMessage({
        text: msg,
        username: this.username,
      });
    }
  }
  onLogout() {
    this.messagesService.clear();
    this.webSocketService.disconnect();
    this.authenticationService.logout();
    this.router.navigate(['']);
  }
}
