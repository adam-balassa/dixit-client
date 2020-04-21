import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/model/game.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @Input() players: Player[];
  @Input() myRound: boolean;
  @Input() endOfRound: boolean;
  @Input() player: Player;
  color: string;

  get vote(): string {
    return this.players.find(p => p.choice.id === this.player.vote.id).name;
  }

  constructor(public game: GameService) {
    this.color = this.generateRandomColor();
  }

  ngOnInit() {
    console.log(this.player.id, this.game.playerId);
    
  }

  generateRandomColor() {
    return '#' + Math.random().toString(16).substr(-6);
}

}
