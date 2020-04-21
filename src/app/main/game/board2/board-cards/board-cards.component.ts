import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService, State } from 'src/app/services/game.service';
import { Game, Card, Member, Player } from 'src/app/model/game.model';
import { ServerService } from 'src/app/services/server.service';

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

  @Input() title: string;
  @Output() titleChange = new EventEmitter<string>();

  @Output() vote = new EventEmitter<Card>();
  constructor(public game: GameService, private server: ServerService) { }

  ngOnInit() {
    this.subscription = this.game.game.subscribe(game => this.init(game));
  }

  init(game: Game): void {
    if (!this.order) this.order = Array.from(new Array(game.members.length).keys());
    const prevState = this.state;
    this.state = this.game.getState();

    const filteredPlayers = game.members.filter(m => m.choice);

    if ((prevState === 'choices' || !prevState) && this.state === 'votes') {
      this.order = this.shuffle(Array.from(new Array(game.members.length).keys()));
    }
    this.players = [];
    this.order.forEach((e, i) => {
      if (filteredPlayers[e])
        this.players.push(filteredPlayers[e]);
    });

    const player = game.members.find(member => member.id === this.game.playerId);
    this.playersVote = player.vote ? player.vote.id : null;
    const currentPlayer = game.members[game.round.number % game.members.length];
    this.correctAnswer = currentPlayer.choice ? currentPlayer.choice.id : null;

    this.players.forEach(p => this.votesForPlayer[p.id] = []);

    if (this.state === 'end-of-round')
      this.players.forEach(p => {
        const votedFor = this.players.find(voted => voted.choice.id === p.vote.id);
        this.votesForPlayer[votedFor.id].push(p);
      });
  }

  onCardClick(card: Card) {
    if (this.state === 'votes')
      this.vote.next(card);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  nextRound() {
    this.server.startRound(this.game.game.value.id);
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

}
