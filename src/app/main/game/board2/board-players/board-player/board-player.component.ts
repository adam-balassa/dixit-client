import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Player, Game } from 'src/app/model/game.model';
import { GameService, State } from 'src/app/services/game.service';
import { Subscription } from 'rxjs';

/**
 * A player on the top of the screen
 */
@Component({
  selector: 'app-board-player',
  templateUrl: './board-player.component.html',
  styleUrls: ['./board-player.component.css']
})
export class BoardPlayerComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  // the player thet the component represents
  @Input() player: Player;
  // the player's avatars color
  color: string;
  myRound: boolean;
  state: State;
  score: number = 0;
  constructor(public game: GameService) { }

  ngOnInit() {
    this.color = this.generateRandomColor();
    this.game.colors[this.player.id] = this.color;
    this.subscription = this.game.game.subscribe(game => {
      this.init(game);
    });
  }

  /**
   * Calculates the players score at the end of the round
   * @param game the games new status
   */
  init(game: Game) {
    this.state = this.game.getState();
    const round = game.round.number;
    const currentPlayerIndex = round % game.members.length;
    const playerOnRound = game.members[currentPlayerIndex].id;
    this.myRound = playerOnRound === this.player.id;
    if (this.state === 'end-of-round') {
      if (this.myRound) {
        if (game.members.every(player => player.vote.id === this.player.choice.id || player.id === this.player.id)) this.score = 0;
        else if (game.members.every(player => player.vote.id !== this.player.choice.id || player.id === this.player.id)) this.score = 0;
        else this.score = 3;
      }
      else {
        const correctId = game.members[currentPlayerIndex].choice.id;
        if (game.members.every(player => player.vote.id === correctId || player.id === playerOnRound)) this.score = 2;
        else if (game.members.every( player => player.vote.id !== correctId || player.id === playerOnRound )) this.score = 2;
        else {
          if (this.player.vote.id === correctId) this.score = 3;
          game.members.forEach(player => {
            if (player.vote.id === this.player.choice.id) this.score++;
          });
        }
      }
    }
  }

  generateRandomColor() {
    return '#' + Math.random().toString(16).substr(-6);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
