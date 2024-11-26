import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionGameComponent } from './reaction-game.component';
import {GameService} from '../../services/reaction-game/game-service/game.service';
import {GameState} from '../../utils/reaction-game/game-state';
import {Subject} from 'rxjs';
import {ScoreBoardComponent} from '../../components/reaction-game/score-board/score-board.component';
import {
  ReactionGameModalComponent
} from '../../components/shared/modal/reaction-game-modal/reaction-game-modal.component';
import {GameBoardColComponent} from '../../components/reaction-game/game-board-col/game-board-col.component';

describe('ReactionGameComponent', () => {
  let component: ReactionGameComponent;
  let fixture: ComponentFixture<ReactionGameComponent>;
  let mockGameService: jasmine.SpyObj<GameService>;
  let gameState$: Subject<GameState>;
  let score$: Subject<{ player: number; computer: number }>;``

  beforeEach(async () => {
    gameState$ = new Subject<GameState>();
    score$ = new Subject<{ player: number; computer: number }>();

    mockGameService = jasmine.createSpyObj('GameService', [
      'getGameState$',
      'getScore$',
      'resetGame',
      'startGame'
    ]);
    await TestBed.configureTestingModule({
      imports: [
        ReactionGameComponent,
        ScoreBoardComponent,
        ReactionGameModalComponent,
        GameBoardColComponent
      ],
      providers: [{ provide: GameService, useValue: mockGameService }]
    }).compileComponents();

    mockGameService.getGameState$.and.returnValue(gameState$.asObservable());
    mockGameService.getScore$.and.returnValue(score$.asObservable());

    fixture = TestBed.createComponent(ReactionGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
