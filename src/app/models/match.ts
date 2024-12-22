import { Team } from './team';

export interface Match {
  id?: string;
  season: string;
  league: string;
  teamHomeId: string;
  teamAwayId: string;
  possessionHome?: number;
  possessionAway?: number;
  goalsHome: number;
  goalsAway: number;
  shotsOnTargetHome?: number;
  shotsOnTargetAway?: number;
  shotsHome?: number;
  shotsAway?: number;
  cornersAway?: number;
  corenrsHome?: number;
  yellowCardsHome: number;
  yellowCardsAway: number;
  redCardsHome: number;
  redCardsAway: number;
  finished: boolean;
  started: boolean;
  halftime: boolean;
  teamWithBall: string;
  halftimeEnd: boolean;
  secondHalf?: number;
  time: number;

    /*
start
idő
gol
sarga
piros
poss
kapuraloves
kaputeltalt
felido
felido vege
vege
 */
}
