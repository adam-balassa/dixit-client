import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/model/game.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @Input() player: Player;
  color: string;

  constructor() {
    this.color = this.generateRandomColor();
  }

  ngOnInit() {
  }

  generateRandomColor() {
    return '#' + Math.random().toString(16).substr(-6);
}

}
