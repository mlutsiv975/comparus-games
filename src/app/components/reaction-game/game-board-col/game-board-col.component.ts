import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { GameService } from '../../../services/reaction-game/game-service/game.service';
import { NgClass } from '@angular/common';
import { CellState } from '../../../utils/reaction-game/cell-state';

@Component({
  selector: 'app-game-board-col',
  imports: [NgClass],
  templateUrl: './game-board-col.component.html',
  styleUrl: './game-board-col.component.scss',
})
export class GameBoardColComponent implements OnInit, OnDestroy {
  state: CellState = CellState.Pristine;
  private timerSubscription: Subscription | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.registerCell(this);

    this.gameService.getCellActivation$().subscribe((cell) => {
      if (cell === this) {
        this.activate();
      }
    });

    this.gameService.getReset$().subscribe(() => {
      this.reset();
    });
  }

  activate() {
    if (this.state !== CellState.Pristine) return;

    this.state = CellState.Active;
    const duration = this.gameService.getDuration();
    this.timerSubscription = timer(duration).subscribe(() => {
      if (this.state === CellState.Active) {
        this.state = CellState.Invalid;
        this.gameService.handleCellCompletion(false);
      }
    });
  }

  onClick() {
    if (this.state === CellState.Active) {
      this.state = CellState.Success;
      this.timerSubscription?.unsubscribe();
      this.gameService.handleCellCompletion(true);
    }
  }

  reset() {
    this.state = CellState.Pristine;
    this.timerSubscription?.unsubscribe();
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  getClassForState(): string {
    switch (this.state) {
      case CellState.Pristine:
        return 'pristine';
      case CellState.Active:
        return 'active';
      case CellState.Success:
        return 'success';
      case CellState.Invalid:
        return 'invalid';
      default:
        return '';
    }
  }
}
