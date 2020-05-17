import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { Game, Player } from 'src/app/model/game.model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

  roomId: string;
  nickName: string;
  constructor(private server: ServerService,
    private router: Router,
    private game: GameService,
    private url: ActivatedRoute,
    private notifier: NotifierService) { }

  ngOnInit() {
    this.roomId = this.url.snapshot.queryParams.roomId || '';
  }

  /**
   * Forwards joining request to server and navigates forward
   */
  async join() {
    try {
      const game: Game = await this.server.getGame(this.roomId);
      const player: Player | undefined = game.members.find(member => member.name === this.nickName);
      if (player) {
        this.game.start(game);
        this.game.playerId = player.id;
        this.router.navigateByUrl('/game/start');
      }
      else {
        const newGame = await this.server.joinRoom(this.roomId, this.nickName);
        const p = game.members.find(member => member.name === this.nickName);
        this.game.playerId = p.id;
        this.game.start(newGame);
        this.router.navigateByUrl('/game/start');
      }
    }
    catch (err) {
      this.notifier.notify('error', 'Invalid roomId');
    }
  }
}
