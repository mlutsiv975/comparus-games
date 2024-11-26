import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameScore} from '../../../interfaces/ reaction-game/reaction-game';
import {ModalBaseComponent} from '../../shared/modal/modal-base/modal-base.component';

@Component({
  selector: 'app-reaction-game-modal',
  imports: [
    ModalBaseComponent
  ],
  templateUrl: './reaction-game-modal.component.html',
  styleUrl: './reaction-game-modal.component.scss'
})
export class ReactionGameModalComponent {
  @Input() score!: GameScore;

  @Output() restart = new EventEmitter<void>();
  @Output() exit = new EventEmitter<void>();

  getWinner(): 'player' | 'computer' {
    return this.score.player >= 10 ? 'player' : 'computer';
  }

  onClose() {
    this.exit.emit();
  }

  onButtonClick(action: string) {
    if (action === 'restart') {
      this.restart.emit();
    } else if (action === 'exit') {
      this.exit.emit();
    }
  }

  getTitle(): string {
    if (this.getWinner() === 'player') {
      return '🎉 Congratulations! You Won! 🎉'
    }
    return '💻 The Computer Won! Better luck next time. 💻'
  }
}
