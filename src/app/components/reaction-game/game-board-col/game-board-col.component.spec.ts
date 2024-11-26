import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoardColComponent } from './game-board-col.component';
import {GameService} from '../../../services/reaction-game/game-service/game.service';
import {Subject} from 'rxjs';
import {CellState} from '../../../utils/reaction-game/cell-state';

describe('GameBoardColComponent', () => {
    let component: GameBoardColComponent;
    let fixture: ComponentFixture<GameBoardColComponent>;
    let mockGameService: jasmine.SpyObj<GameService>;
    let cellActivation$: Subject<GameBoardColComponent>;
    let reset$: Subject<void>;

    beforeEach(async () => {
      cellActivation$ = new Subject<GameBoardColComponent>();
      reset$ = new Subject<void>();

      mockGameService = jasmine.createSpyObj('GameService', [
        'registerCell',
        'getCellActivation$',
        'getReset$',
        'getDuration',
        'handleCellCompletion'
      ]);

      mockGameService.getCellActivation$.and.returnValue(cellActivation$.asObservable());
      mockGameService.getReset$.and.returnValue(reset$.asObservable());
      mockGameService.getDuration.and.returnValue(1000);

      await TestBed.configureTestingModule({
        imports: [GameBoardColComponent],
        providers: [{ provide: GameService, useValue: mockGameService }]
      }).compileComponents();

      fixture = TestBed.createComponent(GameBoardColComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should register itself with the game service on init', () => {
      expect(mockGameService.registerCell).toHaveBeenCalledWith(component);
    });

    it('should activate when the cellActivation$ emits this cell', () => {
      expect(component.state).toBe(CellState.Pristine);
      cellActivation$.next(component);
      expect(component.state).toBe(CellState.Active);
    });

    it('should reset when the reset$ observable emits', () => {
      component.state = CellState.Active;
      reset$.next();
      // @ts-ignore
      expect(component.state).toBe(CellState.Pristine);
    });

    it('should change state to Invalid if not clicked within the duration', (done) => {
      component.activate();
      expect(component.state).toBe(CellState.Active);

      setTimeout(() => {
        expect(component.state).toBe(CellState.Invalid);
        expect(mockGameService.handleCellCompletion).toHaveBeenCalledWith(false);
        done();
      }, mockGameService.getDuration());
    });

    it('should change state to Success and handle completion on click if active', () => {
      component.state = CellState.Active;
      component.onClick();
      // @ts-ignore
      expect(component.state).toBe(CellState.Success);
      expect(mockGameService.handleCellCompletion).toHaveBeenCalledWith(true);
    });



    it('should not change state on click if not active', () => {
      component.state = CellState.Pristine;
      component.onClick();

      expect(component.state).toBe(CellState.Pristine);
      expect(mockGameService.handleCellCompletion).not.toHaveBeenCalled();
    });

    it('should return correct class for state', () => {
      component.state = CellState.Pristine;
      expect(component.getClassForState()).toBe('pristine');

      component.state = CellState.Active;
      expect(component.getClassForState()).toBe('active');

      component.state = CellState.Success;
      expect(component.getClassForState()).toBe('success');

      component.state = CellState.Invalid;
      expect(component.getClassForState()).toBe('invalid');
    });
  });
