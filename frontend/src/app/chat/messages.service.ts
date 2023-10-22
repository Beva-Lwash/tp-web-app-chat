import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Message } from "./message.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  messages = new BehaviorSubject<Message[]>([]);

  constructor(private HttpClient: HttpClient) {}

  postMessage(message: Message): void {
    const newMessage = this.messages.value;
    newMessage.push(message);
    this.messages.next([...newMessage]);   
  }

  getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }

  fetchMessages(): void{
    this.HttpClient.get(`${environment.backendUrl}/messages`);
    this.HttpClient.post(`${environment.backendUrl}/messages`,this.postMessage(Message),{withCredentials}: true);
  }


}
