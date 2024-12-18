import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reset-password-modal',
  standalone: true,
  imports: [],
  templateUrl: './reset-password-modal.component.html',
  styleUrl: './reset-password-modal.component.css'
})
export class ResetPasswordModalComponent {
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() confirmModal = new EventEmitter<string>();
  @Input() gameName: string = '';
  @Input() seller: string = '';

  onClose() {
    this.closeModal.emit();
  }

  onConfirm(input: HTMLInputElement) {
    const inputValue = input.value.trim();

    if (!inputValue) {
      return;
    }

    this.confirmModal.emit(inputValue);
  }
}
