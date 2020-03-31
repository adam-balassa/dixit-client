import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, CanActivate, Router } from '@angular/router';
import { MainComponent } from './main/main.component';
import { IndexComponent } from './main/index/index.component';
import { JoinComponent } from './main/join/join.component';
import { CreateComponent } from './main/create/create.component';
import { GameComponent } from './main/game/game.component';
import { StartComponent } from './main/game/start/start.component';
import { BoardComponent } from './main/game/board/board.component';
import { GameService } from './services/game.service';
@Injectable({
  providedIn: 'root'
})
export class CanBoardActivate implements CanActivate {
  constructor(private game: GameService, private router: Router) {

  }
  canActivate(): Promise<boolean> | boolean {
    if (!this.game.playerId)
      this.router.navigateByUrl('/join');
    return !!this.game.playerId;
  }
}


export const routes: Routes = [
  { path: '', component: MainComponent, pathMatch: 'prefix', children: [
    { path: '', component: IndexComponent, pathMatch: 'full' },
    { path: 'join', component: JoinComponent },
    { path: 'create', component: CreateComponent },
    { path: 'game', component: GameComponent, canActivate: [CanBoardActivate], children: [
      { path: 'start', component: StartComponent },
      { path: 'board', component: BoardComponent }
    ]},
    { path: '**', redirectTo: '/join' }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


