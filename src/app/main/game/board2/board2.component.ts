import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { State, GameService } from 'src/app/services/game.service';
import { Game, Card } from 'src/app/model/game.model';
import { ServerService } from 'src/app/services/server.service';
import { NotifierService } from 'angular-notifier';

/**
 * A component that represents the game's board
 */
@Component({
  selector: 'app-board2',
  templateUrl: './board2.component.html',
  styleUrls: ['./board2.component.css']
})
export class Board2Component implements OnInit, OnDestroy {

  subscription: Subscription;
  message: string;
  state: State;

  title: string;
  constructor(public game: GameService, private server: ServerService, private notifier: NotifierService) { }

  ngOnInit() {
    this.subscription = this.game.game.subscribe(game => this.init(game));
  }

  /**
   * Called each time the game's state has refreshed
   * Shows propriate messages if the game enters a new section
   * @param game the games new state
   */
  init(game: Game): void {
    const newState = this.game.getState();
    if (newState === 'choices' && this.state !== 'choices')
      this.showMessage('The title is ' + game.round.title || this.title);
    else if (newState === 'votes' && this.state !== 'votes')
      this.showMessage('Vote for a card');
    else if (newState === 'choosing-title' && this.state !== 'choosing-title' && this.game.isMyRound())
      this.showMessage('Your turn');
    this.state = newState;
    this.title = game.round.title;
  }

  /**
   * Displays a message on the screen
   * @param msg the message that is to be displayed
   */
  showMessage(msg: string) {
    this.message = msg;
  }

  /**
   * Forwards vote request to server
   * @param card the card that the player has voted for
   */
  vote(card: Card) {
    this.server.addVote(this.game.game.value.id, card.id, this.game.playerId)
    .then(() => { this.refreshVote(card); })
    .catch(err => { this.notifier.notify('error', err.message || 'An error occured uploading your vote'); });
  }

  /**
   * Forwards choice request to server
   * @param card the card thet has been chosen
   */
  choose(card: Card) {
    if (this.state === 'choosing-title' && this.game.isMyRound()) {
      // The current player is on round and has chosen a title
      if (!this.title) {
        this.showMessage('You must choose a title first');
        return;
      }
      this.server.addRoomTitle(this.game.game.value.id, this.title, card.id)
      .then(() => { this.refreshChoice(card); })
      .catch(err => { this.notifier.notify('error', err.message || 'An error occured uploading your choice'); });
    }
    else
      // The current player was not round
      this.server.addChoice(this.game.game.value.id, card.id, this.game.playerId)
      .then(() => { this.refreshChoice(card); })
      .catch(err => { this.notifier.notify('error', err.message || 'An error occured uploading your choice'); });
  }

  /**
   * Refreshes the game's state after a request
   * @param card the card that was chosen
   */
  refreshVote(card: Card) {
    const game = this.game.game.value;
    const player = game.members.find(m => m.id === this.game.playerId);
    player.vote = card;
    this.game.game.next(game);
  }

  /**
   * Refreshes the game's state after a request
   * @param card the card that was chosen
   */
  refreshChoice(card: Card) {
    const game = this.game.game.value;
    const player = game.members.find(m => m.id === this.game.playerId);
    player.choice = card;
    game.round.title = this.title;
    this.game.game.next(game);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
