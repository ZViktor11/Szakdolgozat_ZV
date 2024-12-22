import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Team } from '../models/team';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Match } from '../models/match';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  teams$: Observable<Team[]>;
  teams: Team[];
  leagues=['I. Osztály','II. Osztály','III. Osztály'];
  seasons=['2022/23','2021/22'];
  selectedLeague: string;
  selectedSeason: string;
  matches$: Observable<Match[]>;
  matches: Match[];
  currentMatches: Array<Match>;
  currentTeams: Array<Team>;

  // eslint-disable-next-line max-len
  constructor(private dataServiceMatch: DataService<Match>,private dataServiceTeam: DataService<Team>,private router: Router,private firestore: AngularFirestore) {
    this.teams$=this.dataServiceTeam.getTeamsOrderByPoints('team');
    this.selectedLeague='I. Osztály';
    this.selectedSeason='2022/23';
    this.currentTeams=[];
    this.matches$=this.dataServiceMatch.get('match');
    this.matches$.subscribe(ref=>{
      this.matches=ref;
    });
    this.teams$.subscribe(ref=>{
      this.teams=ref;
      this.currentTeams=[];
      this.teams.forEach(element => {
        if(element.season===this.selectedSeason && element.league===this.selectedLeague){
          this.currentTeams.push(element);
        }
      });
    });
    console.log(this.getTeams('I. Osztály','2022/23'));
  }

  ngOnInit(): void {
    this.getTeams(this.selectedLeague,this.selectedSeason).subscribe(ref=>{
      console.log(ref);
    });
  }

  getTeams(l: string,s: string): Observable<Team[]>{
    return this.firestore.collection('team',ref=>ref.where('season','==',s).where('league','==',l)).valueChanges() as Observable<Team[]>;
  }

  changeTable(){
    this.currentTeams=[];
    this.teams.forEach(element => {
      if(element.season===this.selectedSeason && element.league===this.selectedLeague){
        this.currentTeams.push(element);
      }
    });
    this.calcTable(this.currentTeams);
  }

  calcTable(cMatches){
    cMatches.forEach(element=>{
      console.log(element);
      if(element.goalsAway>element.goalsHome){
      }
    });
  }

/*
  sortTeams() {
    return (this.teams as unknown as Team[]).sort((a, b) => b.points-a.points);
  }*/


}
