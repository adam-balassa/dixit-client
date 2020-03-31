import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/model/game.model';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  @Input() players: Player[];
  constructor() { }

  ngOnInit() {
  }

}
