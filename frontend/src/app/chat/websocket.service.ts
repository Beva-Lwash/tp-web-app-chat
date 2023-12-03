import { Injectable } from "@angular/core";
import { Observable, Subject, timeInterval, timeout } from "rxjs";
import { environment } from "src/environments/environment";

export type WebSocketEvent = "notif";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private retry: boolean;
  private id: any;

  constructor() {
    this.retry = false;
    this.id = 0;
  }

  public connect(): Observable<WebSocketEvent> {
    this.ws = new WebSocket(`${environment.wsUrl}/notifications`);
    const events = new Subject<WebSocketEvent>();

    console.log("Entrée");

    if (this.retry == true) {
      clearTimeout(this.id);
    }

    this.ws.onmessage = () => events.next("notif");

    this.ws.onclose = () => {
      console.log("Closed");
      this.id = setTimeout(() => {
        this.connect();
      }, 2000);
      this.retry = true;
    };

    this.ws.onerror = () => {
      events.error("error");
      console.log("Error");
    };

    return events.asObservable();
  }

  public disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}
