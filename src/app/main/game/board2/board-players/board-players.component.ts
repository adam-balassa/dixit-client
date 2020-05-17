import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Player, Member, Game } from 'src/app/model/game.model';
import { Subscription } from 'rxjs';

/**
 * Represents the players on the top of the screen
 */
@Component({
  selector: 'app-board-players',
  templateUrl: './board-players.component.html',
  styleUrls: ['./board-players.component.css']
})
export class BoardPlayersComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  players: Player[] = [];
  constructor(public game: GameService) { }

  ngOnInit() {
    this.players = this.game.game.value.members;
    this.subscription = this.game.game.subscribe(game => {
      this.init(game);
    });
  }

  /**
   * Displays players on the screen
   * @param game the game's new state
   */
  init(game: Game) {
    game.members.forEach(member => {
      const player = this.players.find(p => p.id === member.id);
      player.choice = member.choice;
      player.hand = member.hand;
      player.name = member.name;
      player.vote = member.vote;
      player.score = member.score;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
