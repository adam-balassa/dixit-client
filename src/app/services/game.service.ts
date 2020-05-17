import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Game, Player } from '../model/game.model';
import { ServerService } from './server.service';

export type State = 'choosing-title' | 'choices' | 'votes' | 'end-of-round';

/**
 * An Angular service to store the games state
 */
@Injectable({
  providedIn: 'root'
})
export class GameService {
  // stores setInterval value so that it can be cancelled
  private infiniteLoop: number;
  // a flag to store whether the current player is the one creating the game
  admin: boolean = false;
  // the playerId of the logged in player
  playerId: string;

  // maps players to colors
  colors: {[id: string]: string} = {};
  // the state of the game
  game: BehaviorSubject<Game> = new BehaviorSubject<Game>(undefined);

  constructor(private server: ServerService) {}

  /**
   * Starts an infinite loop that pings the server
   * @param game the inital state of the game
   */
  start(game: Game) {
    this.game.next(game);
    this.infiniteLoop = window.setInterval(async () => {
      await this.refreshGame();
    }, 5000);
  }

  stop() {
    clearInterval(this.infiniteLoop);
  }

  /**
   * Checks whether the current player is on the round
   */
  isMyRound(): boolean {
    const game = this.game.value;
    const round = game.round.number;
    const currentPlayerIndex = round % game.members.length;

    return game.members[currentPlayerIndex].id === this.playerId;
  }

  /**
   * Maps the game state to an enumeration
   */
  getState(): State {
    const game = this.game.value;
    const members = game.members;
    if (members.every(m => !m.choice)) return 'choosing-title';
    if (members.every(m => !!m.vote)) return 'end-of-round';
    if (members.every(m => !!m.choice)) return 'votes';
    return 'choices';
  }

  private async refreshGame() {
    const game = await this.server.getGame(this.game.value.id);
    const old = this.game.value;

    const changeDetected = this.detectChange(old, game);

    if (changeDetected)
      this.game.next(game);
  }

  private detectChange(old: Game, game: Game): boolean {
    let changeDetected = false;
    if (game.members.length !== old.members.length) changeDetected = true;
    if (game.round.number !== old.round.number) changeDetected = true;
    if (game.round.title !== old.round.title) changeDetected = true;
    if (game.members[0].hand.length !== old.members[0].hand.length) changeDetected = true;
    game.members.forEach((m, i) => {
      if (m.choice && !old.members[i].choice || m.vote && !old.members[i].vote)
        changeDetected = true;
    });
    return changeDetected;
  }

}
