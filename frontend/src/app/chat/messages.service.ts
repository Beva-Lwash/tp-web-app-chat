import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, connect } from "rxjs";
import { Message } from "./message.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { WebSocketService } from "../webSocketService";

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  messages = new BehaviorSubject<Message[]>([]);

  socket= new WebSocketService;

  constructor(private HttpClient: HttpClient) {}

  postMessage(message: Message): void {
    const newMessage = this.messages.value;
    newMessage.push(message);
    this.messages.next([...newMessage]); 
    this.HttpClient.post(`${environment.backendUrl}/messages`,this.messages,{withCredentials: true}) ;
    this.socket.connect();
  }

  getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }

  fetchMessages(): void{
    this.HttpClient.get(`${environment.backendUrl}/messages`);
  }


}
