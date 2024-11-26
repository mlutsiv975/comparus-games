import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactionGameComponent } from './reaction-game.component';
import { GameService } from '../../services/reaction-game/game-service/game.service';
import { ScoreBoardComponent } from '../../components/reaction-game/score-board/score-board.component';
import { GameBoardColComponent } from '../../components/reaction-game/game-board-col/game-board-col.component';
import { ReactionGameModalComponent } from '../../components/reaction-game/reaction-game-modal/reaction-game-modal.component';
import { GameState } from '../../utils/reaction-game/game-state';
import { of, Subject } from 'rxjs';

describe('ReactionGameComponent', () => {
  let component: ReactionGameComponent;
  let fixture: ComponentFixture<ReactionGameComponent>;
  let mockGameService: jasmine.SpyObj<GameService>;
  let gameState$: Subject<GameState>;
  let score$: Subject<{ player: number; computer: number }>;

  beforeEach(async () => {
    gameState$ = new Subject<GameState>();
    score$ = new Subject<{ player: number; computer: number }>();

    mockGameService = jasmine.createSpyObj('GameService', [
      'getGameState$',
      'getScore$',
      'resetGame',
      'startGame',
      'registerCell',
      'getCellActivation$',
      'getReset$'
    ]);

    mockGameService.getGameState$.and.returnValue(gameState$.asObservable());
    mockGameService.getScore$.and.returnValue(score$.asObservable());
    mockGameService.getCellActivation$.and.returnValue(of());
    mockGameService.getReset$.and.returnValue(of());

    await TestBed.configureTestingModule({
      imports: [
        ReactionGameComponent,
        ScoreBoardComponent,
        ReactionGameModalComponent,
        GameBoardColComponent
      ],
      providers: [{ provide: GameService, useValue: mockGameService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ReactionGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start the game and set button label to Restart', () => {
    gameState$.next(GameState.Running);
    fixture.detectChanges();
    expect(component.buttonLabel).toBe('Restart');
  });

  it('should reset the game when the button is clicked and game is running', () => {
    gameState$.next(GameState.Running);
    fixture.detectChanges();

    component.startOrResetGame();
    expect(mockGameService.resetGame).toHaveBeenCalled();
  });

  it('should start the game when the button is clicked and game is ready', () => {
    gameState$.next(GameState.Ready);
    fixture.detectChanges();

    component.startOrResetGame();
    expect(mockGameService.startGame).toHaveBeenCalledWith(component.duration);
  });

  it('should update score when game service emits score changes', () => {
    const score = { player: 3, computer: 2 };
    score$.next(score);
    fixture.detectChanges();

    expect(component.score).toEqual(score);
  });

  it('should show modal when game state is finished', () => {
    gameState$.next(GameState.Finished);
    fixture.detectChanges();
    expect(component.showModal).toBeTrue();
  });

  it('should restart the game when restartGame is called', () => {
    component.restartGame();
    expect(mockGameService.resetGame).toHaveBeenCalled();
    expect(mockGameService.startGame).toHaveBeenCalledWith(component.duration);
  });

  it('should exit the game when exitGame is called', () => {
    component.exitGame();
    expect(component.showModal).toBeFalse();
    expect(mockGameService.resetGame).toHaveBeenCalled();
  });

  it('should unsubscribe from observables on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
