import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-new-message-form",
  templateUrl: "./new-message-form.component.html",
  styleUrls: ["./new-message-form.component.css"],
})
export class NewMessageFormComponent {
  @Output() messagePublished = new EventEmitter<any>();
  file: File | null = null;
  messageForm = this.fb.group({
    msg: "",
  });

  constructor(private fb: FormBuilder) {}

  onPublishMessage() {
    if (this.messageForm.valid) {
      const message = this.messageForm.value.msg;
      this.messagePublished.emit(message);
      this.messageForm.reset();
    }
  }

  fileChanged(event: any) {
    this.file = event.target.files[0];
  }
}
