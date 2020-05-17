import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService, State } from 'src/app/services/game.service';
import { Game, Card, Member, Player } from 'src/app/model/game.model';
import { ServerService } from 'src/app/services/server.service';
import { NotifierService } from 'angular-notifier';

/**
 * Represents the 'center' of the board
 * Displays the chosen title and the chosen cards
 */
@Component({
  selector: 'app-board-cards',
  templateUrl: './board-cards.component.html',
  styleUrls: ['./board-cards.component.css']
})
export class BoardCardsComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  state: State;
  players: Player[];
  playersVote: number;
  correctAnswer: number;
  votesForPlayer: {[id: string]: Player[]} = {};
  order: number[];

  // the chosen title (two-way bound)
  @Input() title: string;
  @Output() titleChange = new EventEmitter<string>();
  // fires, when the player votes for a card
  @Output() vote = new EventEmitter<Card>();

  constructor(public game: GameService, private server: ServerService, private notifier: NotifierService) { }

  ngOnInit() {
    this.subscription = this.game.game.subscribe(game => this.init(game));
  }

  init(game: Game): void {
    if (!this.order) this.order = Array.from(new Array(game.members.length).keys());
    const prevState = this.state;
    this.state = this.game.getState();

    this.displayCards(game, prevState);
    this.updateSelectedCards(game);
    this.displayVotes();
  }

  /**
   * Sets the cards state
   * This state will be displayed at the end of the round
   * @param game the games new state
   */
  updateSelectedCards(game: Game) {
    const player = game.members.find(member => member.id === this.game.playerId);
    this.playersVote = player.vote ? player.vote.id : null;
    const currentPlayer = game.members[game.round.number % game.members.length];
    this.correctAnswer = currentPlayer.choice ? currentPlayer.choice.id : null;
  }

  /**
   * Displays the cards on the board
   * @param game the games next state
   * @param prevState the games previous state
   */
  displayCards(game: Game, prevState: State) {
    const filteredPlayers = game.members.filter(m => m.choice);

    if ((prevState === 'choices' || !prevState) && this.state === 'votes') {
      this.order = this.shuffle(Array.from(new Array(game.members.length).keys()));
    }
    this.players = [];
    this.order.forEach((e, i) => {
      if (filteredPlayers[e])
        this.players.push(filteredPlayers[e]);
    });
  }

  /**
   * Displays users on the cards if they voted for it
   */
  displayVotes() {
    this.players.forEach(p => this.votesForPlayer[p.id] = []);

    if (this.state === 'end-of-round')
      this.players.forEach(p => {
        const votedFor = this.players.find(voted => voted.choice.id === p.vote.id);
        this.votesForPlayer[votedFor.id].push(p);
      });
  }

  /**
   * Fires the vote event
   * @param card the card that is voted for
   */
  onCardClick(card: Card) {
    if (this.state === 'votes')
      this.vote.next(card);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Starts a new round, when the current player decides
   */
  nextRound() {
    this.server.startRound(this.game.game.value.id)
    .catch(err => { this.notifier.notify('error', err.message || 'Cannot start new round'); });
  }

  private shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

}
