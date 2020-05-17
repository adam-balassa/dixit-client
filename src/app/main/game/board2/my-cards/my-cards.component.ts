import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { State, GameService } from 'src/app/services/game.service';
import { Game, Card } from 'src/app/model/game.model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-my-cards',
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.css']
})
export class MyCardsComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  message: string;

  state: State;
  cards: Card[];

  @Output() choose = new EventEmitter<Card>();
  constructor(public game: GameService) { }

  ngOnInit() {
    this.subscription = this.game.game.subscribe(game => this.init(game));
  }

  init(game: Game): void {
    this.state = this.game.getState();
    const player = game.members.find(member => member.id === this.game.playerId);
    this.cards = player.hand.filter(card => !player.choice || player.choice.id !== card.id);
  }

  onCardClick(card: Card) {
    const player = this.game.game.value.members.find(member => member.id === this.game.playerId);
    if (this.state === 'choices' && !player.choice || this.state === 'choosing-title' && this.game.isMyRound())
      this.choose.next(card);
    else
      this.message = 'You shouldn\'t choose a card now';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
