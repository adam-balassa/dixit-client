import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { State, GameService } from 'src/app/services/game.service';
import { Game, Card } from 'src/app/model/game.model';
import { ServerService } from 'src/app/services/server.service';
import { NotifierService } from 'angular-notifier';

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

  init(game: Game): void {
    const newState = this.game.getState();
    if (newState === 'choices' && this.state !== 'choices')
      this.showMessage('The title is ' + game.round.title);
    else if (newState === 'votes' && this.state !== 'votes')
      this.showMessage('Vote for a card');
    else if (newState === 'choosing-title' && this.state !== 'choosing-title' && this.game.isMyRound())
      this.showMessage('Your turn');
    this.state = newState;
    this.title = game.round.title;
  }

  showMessage(msg: string) {
    this.message = msg;
  }

  vote(card: Card) {
    this.server.addVote(this.game.game.value.id, card.id, this.game.playerId)
    .then(() => { this.refresh(card); })
    .catch(err => { this.notifier.notify('error', err.message || 'An error occured uploading your vote'); });
  }

  choose(card: Card) {
    if (this.state === 'choosing-title' && this.game.isMyRound()) {
      if (!this.title) {
        this.showMessage('You must choose a title first');
        return;
      }
      this.server.addRoomTitle(this.game.game.value.id, this.title, card.id)
      .then(() => { this.refresh(card); })
      .catch(err => { this.notifier.notify('error', err.message || 'An error occured uploading your choice'); });
    }
    else
      this.server.addChoice(this.game.game.value.id, card.id, this.game.playerId)
      .then(() => { this.refresh(card); })
      .catch(err => { this.notifier.notify('error', err.message || 'An error occured uploading your choice'); });
  }

  refresh(card: Card) {
    const game = this.game.game.value;
    const player = game.members.find(m => m.id === this.game.playerId);
    player.vote = card;
    this.game.game.next(game);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
