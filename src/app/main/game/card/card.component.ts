import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'src/app/model/game.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  src: string;
  @Input() card: Card;
  back: boolean = false;
  @Input('back') set _back(value: boolean) {
    this.back = value;
    this.refreshSrc();
  }

  constructor() { }

  ngOnInit() {
    this.refreshSrc();
  }

  refreshSrc() {
    if (!this.back)
      this.src = `../../../../assets/cards/card_00${this.pad(this.card.id + 1, 3)}.jpg`;
    else
      this.src = '../../../../assets/back.png';
  }

  private pad(num: number, len: number): string {
    return (Array(len).join('0') + num).slice(-len);
  }

}
