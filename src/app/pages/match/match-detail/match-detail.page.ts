import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Match } from 'src/app/models/match';
import { Player } from 'src/app/models/player';
import { Team } from 'src/app/models/team';
import { DataService } from 'src/app/services/data.service';
import { AddGoalToPlayerComponent } from '../add-goal-to-player/add-goal-to-player.component';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.page.html',
  styleUrls: ['./match-detail.page.scss'],
})
export class MatchDetailPage implements OnInit {
  matchId: string;
  currentMatch$: Observable<Match>;
  currentMatch: Match;
  eltelt: string;
  counter: number;
  teamHome$: Observable<Team>;
  teamAway$: Observable<Team>;
  teamHome: Team;
  teamAway: Team;
  q: number;
  p: number;
  minute: number;
  second: number;
  teamWB: string;
  playersHome$: Observable<Player[]>;
  playersAway$: Observable<Player[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataServiceMatch: DataService<Match>,
    private dataServiceTeam: DataService<Team>,
    private dataServicePlayer: DataService<Player>,
    private modalCtrl: ModalController
    ) {
    this.matchId=this.activatedRoute.snapshot.paramMap.get('id');
    this.currentMatch$=this.dataServiceMatch.getById('match',this.matchId);
    this.currentMatch$.subscribe(res=>{
      this.currentMatch=res;
      let dsa=Math.round((Date.now()-this.currentMatch.time)/1000);
      console.log(dsa,this.currentMatch.time);
      if(this.currentMatch.time===0){
        dsa=0;
      }
      if(this.currentMatch.time%60>9){
        this.second=(dsa%60);
      }else{
        this.second=(dsa%60);
      }
      if(dsa/60>10){
        this.minute=Math.floor(dsa/60);
      }else{
        this.minute=Math.floor(dsa/60);
      }
      if(this.currentMatch.possessionHome===0 && this.currentMatch.possessionAway>0){
        this.p=1;
      }else if(this.currentMatch.possessionAway===0 && this.currentMatch.possessionHome>0){
        this.p=0;
      }
      if(this.currentMatch.goalsHome===0 && this.currentMatch.goalsAway>0){
        this.q=1;
      }else if(this.currentMatch.goalsAway===0 && this.currentMatch.goalsHome>0){
        this.q=0;
      }
      this.q=this.currentMatch.goalsHome/(this.currentMatch.goalsHome+this.currentMatch.goalsAway);
      this.p=this.currentMatch.possessionHome/(this.currentMatch.possessionHome+this.currentMatch.possessionAway);
      this.playersHome$=this.dataServicePlayer.getPlayersFromTeamById('player',res.teamHomeId);
      this.playersAway$=this.dataServicePlayer.getPlayersFromTeamById('player',res.teamAwayId);
      this.teamHome$=this.dataServiceTeam.getById('team',res.teamHomeId);
      this.teamHome$.subscribe(element=>{
        this.teamHome=element;
      });
      this.teamAway$=this.dataServiceTeam.getById('team',res.teamAwayId);
      this.teamAway$.subscribe(element=>{
        this.teamAway=element;
      });
      /*
      if(this.currentMatch.started){
        this.run(this.currentMatch.time);
        console.log('11');
      }
      */
    });
  }

  ngOnInit() {
  }
  pontHozzaad(){
    if(this.currentMatch.goalsAway===this.currentMatch.goalsHome){
      console.log('X');
    }
    else if(this.currentMatch.goalsAway>this.currentMatch.goalsHome){
      console.log('A');
    }
    else if(this.currentMatch.goalsAway<this.currentMatch.goalsHome){
      console.log('H');
    }
  }

  endOfTheMatch(){
    this.currentMatch.finished=true;
    this.dataServiceMatch.update('match',this.matchId,this.currentMatch);
  }

  async addGoalToPlayer(str){
    const modal=await this.modalCtrl.create({
      component: AddGoalToPlayerComponent,
      componentProps:{homeId: this.teamHome.id,awayId: this.teamAway.id,whichTeam: str},
      breakpoints: [0,0.5,0.8],
      initialBreakpoint: 0.5
    });
    modal.present();
  }

  addGoal(str){
    this.addGoalToPlayer(str);
    console.log(this.minute+1);
    if(str==='home'){
      this.currentMatch.goalsHome++;
      this.teamHome.gf++;
      this.teamAway.ga++;
      this.dataServiceTeam.update('team',this.currentMatch.teamHomeId,this.teamHome);
      this.dataServiceTeam.update('team',this.currentMatch.teamAwayId,this.teamAway);
    }else if(str==='away'){
      this.currentMatch.goalsAway++;
      this.teamHome.ga++;
      this.teamAway.gf++;
      this.dataServiceTeam.update('team',this.currentMatch.teamHomeId,this.teamHome);
      this.dataServiceTeam.update('team',this.currentMatch.teamAwayId,this.teamAway);
    }
    if(this.currentMatch.goalsHome===0 && this.currentMatch.goalsAway>0){
      this.q=1;
    }else if(this.currentMatch.goalsAway===0 && this.currentMatch.goalsHome>0){
      this.q=0;
    }else{
    }

    this.dataServiceMatch.update('match',this.matchId,this.currentMatch);

    this.q=this.currentMatch.goalsHome/(this.currentMatch.goalsHome+this.currentMatch.goalsAway);
  }

  teamWithBall(str){
    this.teamWB=str;
    console.log(this.teamWB);
  }

  funPossession(){
    if(this.teamWB==='home'){
      this.currentMatch.possessionHome++;
    }else if(this.teamWB==='away'){
      this.currentMatch.possessionAway++;
    }
    if(this.currentMatch.possessionHome===0 && this.currentMatch.possessionAway>0){
      this.p=1;
    }else if(this.currentMatch.possessionAway===0 && this.currentMatch.possessionHome>0){
      this.p=0;
    }
    this.p=this.currentMatch.possessionHome/(this.currentMatch.possessionHome+this.currentMatch.possessionAway);
  }

  startMatch(){this.currentMatch$=this.dataServiceMatch.getById('match',this.matchId);
    this.currentMatch$.subscribe(res=>{
      this.teamHome$=this.dataServiceTeam.getById('team',res.teamHomeId);
      this.teamAway$=this.dataServiceTeam.getById('team',res.teamAwayId);
    });
    this.teamHome$.subscribe(res=>{
      this.teamHome=res;
    });
    this.teamAway$.subscribe(res=>{
      this.teamAway=res;
    });

    /*
              !!
             !!!!
             !!!!
             !!!!
              !!

              !!
              !!

    */

    if(this.currentMatch.started){
      this.run(this.currentMatch.time);
      this.currentMatch.started=true;
    }else{
      this.currentMatch.time=Date.now();
      this.run(this.currentMatch.time);
      this.currentMatch.started=true;
    }
    this.dataServiceMatch.update('match',this.matchId,this.currentMatch);
  }


  run(date: number){
    setInterval(()=>this.clock(date),1000);
  }

  clock(date: number){
    console.log('asd');
    if(!this.currentMatch.finished){
      const timerNumber=Math.round((Date.now()-date)/1000);
      this.funPossession();
      if(timerNumber%60>9){
        this.second=(timerNumber%60);
      }else{
        this.second=(timerNumber%60);
      }
      if(timerNumber/60>10){
        this.minute=Math.floor(timerNumber/60);
      }else{
        this.minute=(Math.floor(timerNumber/60));
      }
      if(timerNumber%30===0){
        console.log('frissitve');
        this.dataServiceMatch.update('match',this.matchId,this.currentMatch);
      }
    }
    console.log('asd');
  }
}


