import { Component, Input } from '@angular/core';
import { GameScore } from '../../../interfaces/ reaction-game/reaction-game';

@Component({
  selector: 'app-score-board',
  imports: [],
  templateUrl: './score-board.component.html',
  styleUrl: './score-board.component.scss',
})
export class ScoreBoardComponent {
  @Input() score: GameScore = {
    player: 0,
    computer: 0,
  };
}
