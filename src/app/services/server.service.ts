import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Request } from 'src/app/model/request.model';
import { Game } from '../model/game.model';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) { }

  createRoom(name: string): Promise<Game> {
    return new Request<Game>(this.http).post('/rooms', { name });
  }

  joinRoom(roomId: string, name: string): Promise<Game> {
    return new Request<Game>(this.http).post(`/rooms/${roomId}/members`, { name });
  }

  startGame(roomId: string): Promise<Game> {
    return new Request<Game>(this.http).patch(`/games/${roomId}`);
  }

  startRound(roomId: string): Promise<Game> {
    return new Request<Game>(this.http).patch(`/games/${roomId}/round`);
  }

  getGame(roomId: string): Promise<Game> {
    return new Request<Game>(this.http).get(`/games/${roomId}`);
  }

  addRoomTitle(roomId: string, title: string, card: number): Promise<Game> {
    return new Request<Game>(this.http).post(`/games/${roomId}/round`, { title, card });
  }

  addChoice(roomId: string, choice: number, playerId: string): Promise<Game> {
    return new Request<Game>(this.http).post(`/games/${roomId}/choice`, { choice, playerId });
  }

  addVote(roomId: string, vote: number, playerId: string): Promise<Game> {
    return new Request<Game>(this.http).post(`/games/${roomId}/vote`, { vote, playerId });
  }
}
