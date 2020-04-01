import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { ServerService } from 'src/app/services/server.service';
import { Subscription, Observable } from 'rxjs';
import { Game, Card } from 'src/app/model/game.model';
import { Player } from '@angular/core/src/render3/interfaces/player';
import { animation } from 'src/app/components/animations';
type Status = 'end of round' | 'votes' | 'title' | 'choices';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  animations: [ animation() ]
})
export class BoardComponent implements OnInit, OnDestroy {
  game: Observable<Game>;
  subscription: Subscription;

  message?: string;
  status: Status;

  choices: Card[];
  votes: Player[];
  myCards: Card[];
  round: number;
  myIndex: number;
  title: string;
  correctAnswer: number = -1;
  shuffledChoices: Card[];

  constructor(public gameService: GameService, private server: ServerService) { }

  ngOnInit() {
    this.myIndex = this.gameService.game.value.members.findIndex(member => member.id === this.gameService.playerId);

    this.gameRefreshed(this.gameService.game.value);
    this.game = this.gameService.game.asObservable();
    this.subscription = this.game.subscribe(game => {
     this.gameRefreshed(game);
    });
  }

  gameRefreshed(game: Game) {
    this.setMyHand(game);
    this.setChoices(game);
    this.round = game.round.number % game.members.length;
    if (game.members.every(m => !!m.vote)) return this.endOfRound(game);
    if (game.members.every(m => !!m.choice)) return this.startVotes(game);
    if (game.members.every(m => !m.vote && !m.choice)) return this.chooseTitle(game);
    this.startChoices(game);
  }

  endOfRound(game: Game) {
    if (this.status === 'end of round') return;
    this.status = 'end of round';
    this.message = 'End of round';
    this.correctAnswer = game.members[this.round].choice.id;
  }

  startVotes(game: Game) {
    if (this.status === 'votes') return;
    this.shuffledChoices = this.shuffle(this.choices);
    this.status = 'votes';

    this.message = 'Make your vote';
  }

  chooseTitle(game: Game) {
    this.shuffledChoices = this.choices;
    if (this.status === 'title') return;
    this.correctAnswer = -1;
    this.status = 'title';

    if (this.gameService.isMyRound()) {
      this.message = 'Your turn';
    }
  }

  startChoices(game: Game) {
    this.shuffledChoices = this.shuffle(this.choices);
    if (this.status === 'choices') return;
    this.correctAnswer = -1;
    this.status = 'choices';

    if (!this.gameService.isMyRound())
      this.message = `The title is ${ game.round.title }`;
  }

  onCardClick(card: Card) {
    if (this.gameService.game.value.members[this.myIndex].choice) return;
    if (this.gameService.isMyRound()) {
      if (!this.title) this.showMesage('Choose the title first');
      else {
        this.server.addRoomTitle(this.gameService.game.value.id, this.title, card.id)
        .then(() => { this.title = ''; });
        const game = this.gameService.game.value;
        this.shuffledChoices.push({id: card.id});
        this.setMyHand(game);
      }
    }
    else {
      this.server.addChoice(this.gameService.game.value.id, card.id, this.gameService.playerId);
      const game = this.gameService.game.value;
      this.shuffledChoices.push({id: card.id});
      this.setMyHand(game);
    }
  }

  onChoiceClick(card: Card) {
    if (this.status !== 'votes') return;
    this.server.addVote(this.gameService.game.value.id, card.id, this.gameService.playerId);
    const game = this.gameService.game.value;
    game.members[this.myIndex].vote = card;
    this.gameService.game.next(game);
  }

  nextRound() {
    this.server.startRound(this.gameService.game.value.id);
  }

  setMyHand(game: Game) {
    const me = game.members[this.myIndex];
    this.myCards = game.members[this.myIndex].hand;
    if (me.choice)
      this.myCards.splice(this.myCards.findIndex(card => card.id === me.choice.id), 1);
  }

  setChoices(game: Game) {
    this.choices = game.members.filter(member => !!member.choice).map(member => member.choice);
  }

  showMesage(message: string) {
    this.message = message;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
}
