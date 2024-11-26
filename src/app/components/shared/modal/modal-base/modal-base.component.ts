import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-modal-base',
  imports: [
    NgClass
  ],
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.scss'
})
export class ModalBaseComponent {
  @Input() title: string = '';
  @Input() buttons: { text: string; class: string; action: string }[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<string>();

  onClose() {
    this.close.emit();
  }

  onButtonClick(button: { text: string; action: string }) {
    this.buttonClick.emit(button.action);
  }
}
