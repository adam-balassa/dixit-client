import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate, AnimationTriggerMetadata } from '@angular/animations';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  animations: [
    trigger('appear', [
      transition('void => *', [
        style({ opacity: 0, transform: `scale(0.5)` }),
        animate(`1200ms ease`),
        style({ opacity: 1, transform: `scale(1)` }),
      ]),
      transition('* => void', [
        animate(`800ms ease`),
        style({ opacity: 0, transform: `scale(1.2)` }),
      ]),
  ])]
})
export class MessageComponent implements OnInit {
  message: string | undefined;
  @Input('message') set setMessage(value: string | undefined) {
    this.message = value;
    if (value !== undefined)
      setTimeout(() => {
        console.log('disappear');
        this.message = undefined;
        this.messageChange.next(undefined);
      }, 1200);
  }
  @Output() messageChange = new EventEmitter<string>(undefined);
  constructor() { }

  ngOnInit() {
  }

}
