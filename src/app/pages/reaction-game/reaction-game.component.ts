import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GameService} from '../../services/reaction-game/game-service/game.service';
import {ScoreBoardComponent} from '../../components/reaction-game/score-board/score-board.component';
import {GameBoardColComponent} from '../../components/reaction-game/game-board-col/game-board-col.component';
import {
  ReactionGameModalComponent
} from '../../components/reaction-game/reaction-game-modal/reaction-game-modal.component';
import {GameState} from '../../utils/reaction-game/game-state';
import {Subject, takeUntil} from 'rxjs';
import {REACTION_GAME_CONFIG} from '../../utils/reaction-game/config';

@Component({
  selector: 'app-reaction-game',
  imports: [FormsModule, ScoreBoardComponent, GameBoardColComponent, ReactionGameModalComponent],
  templateUrl: './reaction-game.component.html',
  styleUrl: './reaction-game.component.scss'
})
export class ReactionGameComponent implements OnInit, OnDestroy {
  rows = Array.from({ length: REACTION_GAME_CONFIG.boardRows }, (_, i) => i);
  columns = Array.from({ length: REACTION_GAME_CONFIG.boardColumns }, (_, i) => i);
  duration = 1000;
  score = { player: 0, computer: 0 };
  buttonLabel = 'Start';
  showModal = false;
  currentGameState: GameState = GameState.Ready;

  protected readonly gameStateEnum = GameState;
  private destroy$ = new Subject<void>();

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.getGameState$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
      this.currentGameState = state;
      this.buttonLabel = state === GameState.Ready ? 'Start' : 'Restart';
      this.showModal = state === GameState.Finished;
    });

    this.gameService.getScore$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(score => {
      this.score = score;
    });
  }

  startOrResetGame() {
    if (this.currentGameState === GameState.Running) {
      this.gameService.resetGame();
    } else {
      this.gameService.startGame(this.duration);
    }
  }

  restartGame() {
    this.showModal = false;
    this.gameService.resetGame();
    this.gameService.startGame(this.duration);
  }

  exitGame() {
    this.showModal = false;
    this.gameService.resetGame();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
