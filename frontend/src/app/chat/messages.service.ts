import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, connect, firstValueFrom } from "rxjs";
import { Message, NewMessageResquest} from "./message.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  messages = new BehaviorSubject<Message[]>([]);


  constructor(private HttpClient: HttpClient) {}

  async postMessage(message: NewMessageResquest): Promise<Message> {
    return firstValueFrom(
      this.HttpClient.post<Message>(
        `${environment.backendUrl}/messages`,
        message,
        {
          withCredentials: true,
        }
      )
    );
  }

  getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }

   async fetchMessages(){
    const lastMessageId =
      this.messages.value.length > 0
        ? this.messages.value[this.messages.value.length - 1].id
        : null;
    let queryParameters =
      lastMessageId != null
        ? new HttpParams().set("fromId", lastMessageId)
        : new HttpParams();

    const messages = await firstValueFrom(
      this.HttpClient.get<Message[]>(`${environment.backendUrl}/messages`, {
        params: queryParameters,
        withCredentials: true,
      })
    );
    this.messages.next([...this.messages.value, ...messages]);

  }

  clear(){
    this.messages.next([]);
  }

}
