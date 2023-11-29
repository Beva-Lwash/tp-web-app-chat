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
  private id: number;

  constructor() {
    this.retry = false;
  }

  public connect(): Observable<WebSocketEvent> {
    this.ws = new WebSocket(`${environment.wsUrl}/notifications`);
    const events = new Subject<WebSocketEvent>();
    if (this.retry == true) {
      clearTimeout(this.id);
      events.complete();
    }
    this.ws.onmessage = () => events.next("notif");

    this.ws.onclose = () => {
      this.id = window.setTimeout(this.connect, 2000);
      this.retry = true;
    };

    this.ws.onerror = () => events.error("error");

    return events.asObservable();
  }

  public disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}
