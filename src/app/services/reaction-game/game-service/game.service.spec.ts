import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';
import {GameState} from '../../../utils/reaction-game/game-state';
import {REACTION_GAME_CONFIG} from '../../../utils/reaction-game/config';
import {GameBoardColComponent} from '../../../components/reaction-game/game-board-col/game-board-col.component';
import {CellState} from '../../../utils/reaction-game/cell-state';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a cell', () => {
    const cell = jasmine.createSpyObj('GameBoardColComponent', ['reset']);
    service.registerCell(cell);
    expect(service['cells'].getValue().length).toBe(1);
  });

  it('should reset the game and all cells', () => {
    const cell = jasmine.createSpyObj('GameBoardColComponent', ['reset']);
    service.registerCell(cell);
    cell.state = CellState.Active;

    service.resetGame();
    service.getGameState$().subscribe(state => {
      expect(state).toBe(GameState.Ready);
    });
    expect(cell.reset).toHaveBeenCalled();
  });

  it('should handle cell completion and update the score', () => {
    service.handleCellCompletion(true);
    let score = service['score$'].getValue();
    expect(score.player).toBe(1);
    expect(score.computer).toBe(0);

    service.handleCellCompletion(false);
    score = service['score$'].getValue();
    expect(score.player).toBe(1);
    expect(score.computer).toBe(1);
  });

  it('should finish the game when max score is reached', () => {
    const maxScore = REACTION_GAME_CONFIG.maxGameScore;
    const score = { player: maxScore, computer: 0 };
    service['score$'].next(score);

    service.handleCellCompletion(true);
    service.getGameState$().subscribe(state => {
      expect(state).toBe(GameState.Finished);
    });
  });
});
