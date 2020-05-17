import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { ServerService } from 'src/app/services/server.service';
import { Observable, Subscription } from 'rxjs';
import { Game } from 'src/app/model/game.model';
import { Router } from '@angular/router';

/**
 * Represents the lobby before the game starts
 */
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, OnDestroy {

  game: Observable<Game>;
  subscription: Subscription;
  constructor(public gameService: GameService, private router: Router, private server: ServerService) { }

  ngOnInit() {
    this.game = this.gameService.game.asObservable();
    this.subscription = this.game.subscribe(game => {
      if (game.members[0].hand.length > 0)
        this.gameStarted();
    });
    console.log(this.game);
  }

  /**
   * Navigates to game when the admin has started the game
   */
  gameStarted() {
    this.router.navigateByUrl('/game/board');
  }

  /**
   * A function that only admins can call, starts the game
   */
  async startGame() {
    await this.server.startGame(this.gameService.game.value.id);
    this.gameStarted();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
