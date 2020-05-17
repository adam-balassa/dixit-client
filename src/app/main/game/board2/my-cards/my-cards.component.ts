import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { State, GameService } from 'src/app/services/game.service';
import { Game, Card } from 'src/app/model/game.model';
import { NotifierService } from 'angular-notifier';

/**
 * Represents the players cards on the bottom of the screen
 */
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

  // Output event when a card had been chosen
  @Output() choose = new EventEmitter<Card>();

  constructor(public game: GameService) { }

  ngOnInit() {
    this.subscription = this.game.game.subscribe(game => this.init(game));
  }

  /**
   * Runs each time the game's change has refreshed
   * @param game the game's new state
   */
  init(game: Game): void {
    this.state = this.game.getState();
    const player = game.members.find(member => member.id === this.game.playerId);
    this.cards = player.hand.filter(card => !player.choice || player.choice.id !== card.id);
  }

  /**
   * Fires an event that the player has chosen a card (if necessarx)
   * @param card the players choice
   */
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
