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
  @Output() confirmModal = new EventEmitter<boolean>();
  @Input() gameName: string = '';
  @Input() seller: string = '';

  onClose() {
    this.closeModal.emit();
  }

  onConfirm() {
    this.confirmModal.emit();
  }
}
