import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  roomName: string;
  nickName: string;
  constructor(private server: ServerService, private router: Router, private game: GameService) { }

  ngOnInit() {
  }

  async create() {
    let game = await this.server.createRoom(this.roomName);
    game = await this.server.joinRoom(game.id, this.nickName);

    const player = game.members[0];
    this.game.playerId = player.id;
    this.game.admin = true;
    this.game.start(game);
    this.router.navigateByUrl('/game/start');
  }

}
