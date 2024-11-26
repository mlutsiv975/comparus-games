import {Injectable} from '@angular/core';
import {GameBoardColComponent} from '../../../components/reaction-game/game-board-col/game-board-col.component';
import {BehaviorSubject, Subject} from 'rxjs';
import {GameScore} from '../../../interfaces/ reaction-game/reaction-game';
import {CellState} from '../../../utils/reaction-game/cell-state';
import {REACTION_GAME_CONFIG} from '../../../utils/reaction-game/config';
import {GameState} from '../../../utils/reaction-game/game-state';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private cells: GameBoardColComponent[] = [];
  private duration: number = 1000;

  private gameState$ = new BehaviorSubject<GameState>(GameState.Ready);
  private score$ = new BehaviorSubject<GameScore>({ player: 0, computer: 0 });
  private cellActivation$ = new Subject<GameBoardColComponent>();
  private reset$ = new Subject<void>();

  registerCell(cell: GameBoardColComponent) {
    this.cells.push(cell);
  }

  startGame(duration: number) {
    this.duration = duration;
    this.resetGame();
    this.gameState$.next(GameState.Running);
    this.activateNextCell();
  }

  resetGame() {
    this.cells.forEach(cell => cell.reset());
    this.score$.next({ player: 0, computer: 0 });
    this.gameState$.next(GameState.Ready);
    this.reset$.next();
  }

  activateNextCell() {
    const randomCell = this.getRandomPristineCell();
    if (randomCell) {
      this.cellActivation$.next(randomCell);
    } else {
      this.finishGame();
    }
  }

  handleCellCompletion(success: boolean) {
    const score = this.score$.getValue();
    if (success) {
      this.score$.next({ ...score, player: score.player + 1 });
    } else {
      this.score$.next({ ...score, computer: score.computer + 1 });
    }

    if (this.isGameOver()) {
      this.finishGame();
    } else {
      this.activateNextCell();
    }
  }

  getDuration() {
    return this.duration;
  }

  getGameState$() {
    return this.gameState$.asObservable();
  }

  getScore$() {
    return this.score$.asObservable();
  }

  getCellActivation$() {
    return this.cellActivation$.asObservable();
  }

  getReset$() {
    return this.reset$.asObservable();
  }

  private getRandomPristineCell(): GameBoardColComponent | null {
    const pristineCells = this.cells.filter(cell => cell.state === CellState.Pristine);
    if (pristineCells.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pristineCells.length);
    return pristineCells[randomIndex];
  }

  private isGameOver(): boolean {
    const score = this.score$.getValue();
    return (
      score.player >= REACTION_GAME_CONFIG.maxGameScore ||
      score.computer >= REACTION_GAME_CONFIG.maxGameScore
    );
  }

  private finishGame() {
    this.gameState$.next(GameState.Finished);
  }
}
