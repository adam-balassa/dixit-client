import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { ServerService } from 'src/app/services/server.service';
import { Observable, Subscription } from 'rxjs';
import { Game } from 'src/app/model/game.model';
import { Router } from '@angular/router';

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

  gameStarted() {
    this.router.navigateByUrl('/game/board');
  }

  async startGame() {
    await this.server.startGame(this.gameService.game.value.id);
    this.gameStarted();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
