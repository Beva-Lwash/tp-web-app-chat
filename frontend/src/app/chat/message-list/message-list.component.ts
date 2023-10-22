import { Component, Input , OnInit, ElementRef, ViewChild, AfterViewChecked} from '@angular/core';
import { Message } from '../message.model';
@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements  OnInit, AfterViewChecked {
  @Input() messages: Message[] | null = [];
  
  @ViewChild('chatContainer', { static: true }) myScrollContainer:
    | ElementRef
    | any;


    ngOnInit(): void {
      this.scrollToBottom();
    }
  
    ngAfterViewChecked(): void {
      this.scrollToBottom();
    }
  
    scrollToBottom(): void {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }
   /** Afficher la date seulement si la date du message précédent est différente du message courant. */
   showDateHeader(messages: Message[] | null, i: number) {
    if (messages != null) {
      if (i === 0) {
        return true;
      } else {
        const prev = new Date(messages[i - 1].timestamp).setHours(0, 0, 0, 0);
        const curr = new Date(messages[i].timestamp).setHours(0, 0, 0, 0);
        return prev != curr;
      }
    }
    return false;
  }
}
