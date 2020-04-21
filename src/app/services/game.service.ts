import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Game, Player } from '../model/game.model';
import { ServerService } from './server.service';

export type State = 'choosing-title' | 'choices' | 'votes' | 'end-of-round';

// tslint:disable-next-line: max-line-length
// const a = `{"id":"629-04f-c9","members":[{"name":"Adam","choice": {"id": 0}, "hand":[{"id":94},{"id":76},{"id":6},{"id":63},{"id":55},{"id":48}],"id":"aeb-340-8a","score":4},{"name":"Bene","hand":[{"id":80},{"id":32},{"id":65},{"id":4},{"id":69},{"id":13}],"id":"676-648-ee","score":1},{"name":"Teo","hand":[{"id":18},{"id":58},{"id":88},{"id":98},{"id":3},{"id":72}],"id":"f34-44e-3d","score":0}],"deck":[{"id":15},{"id":70},{"id":67},{"id":100},{"id":75},{"id":28},{"id":29},{"id":39},{"id":49},{"id":46},{"id":92},{"id":8},{"id":44},{"id":56},{"id":41},{"id":60},{"id":86},{"id":85},{"id":17},{"id":62},{"id":50},{"id":38},{"id":61},{"id":52},{"id":19},{"id":10},{"id":7},{"id":66},{"id":59},{"id":91},{"id":89},{"id":97},{"id":43},{"id":24},{"id":5},{"id":12},{"id":14},{"id":22},{"id":82},{"id":35},{"id":21},{"id":16},{"id":78},{"id":40},{"id":26},{"id":95},{"id":51},{"id":25},{"id":90},{"id":23},{"id":34},{"id":37},{"id":83},{"id":33},{"id":99},{"id":64},{"id":45},{"id":79},{"id":27},{"id":31},{"id":20},{"id":77},{"id":93},{"id":68},{"id":11},{"id":47},{"id":36},{"id":87},{"id":71},{"id":30},{"id":9},{"id":73},{"id":53},{"id":84},{"id":54},{"id":81},{"id":1},{"id":74},{"id":96}],"name":"Test room 2","round":{"number":1,"title":"Narnia krónikái"}}`
@Injectable({
  providedIn: 'root'
})
export class GameService {
  private infiniteLoop: number;
  admin: boolean = false;
  playerId: string;

  colors: {[id: string]: string} = {};
  game: BehaviorSubject<Game> = new BehaviorSubject<Game>(undefined);
  constructor(private server: ServerService) {
    //  this.start(null);
  }

  start(game: Game) {
    // this.game.next(JSON.parse(a));
    // this.admin = true;
    // this.playerId = 'aeb-340-8a';
    // this.playerId = 'f34-44e-3d';
    // this.playerId = '676-648-ee';

    this.game.next(game);
    this.infiniteLoop = window.setInterval(async () => {
      await this.refreshGame();
    }, 5000);
  }

  stop() {
    clearInterval(this.infiniteLoop);
  }

  isMyRound(): boolean {
    const game = this.game.value;
    const round = game.round.number;
    const currentPlayerIndex = round % game.members.length;

    return game.members[currentPlayerIndex].id === this.playerId;
  }

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
    let changeDetected = false;
    if (game.members.length !== old.members.length) changeDetected = true;
    if (game.round.number !== old.round.number) changeDetected = true;
    if (game.round.title !== old.round.title) changeDetected = true;
    if (game.members[0].hand.length !== old.members[0].hand.length) changeDetected = true;
    game.members.forEach((m, i) => {
      if (m.choice && !old.members[i].choice || m.vote && !old.members[i].vote)
        changeDetected = true;
    });

    if (changeDetected) {
      this.game.next(game);
      console.log('changed');
    }
  }
}
