import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent {
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() confirmModal = new EventEmitter<void>();
  @Input() modalTitle: string = '';
  @Input() modalBody: string = '';

  onClose() {
    this.closeModal.emit();
  }

  onConfirm() {
    this.confirmModal.emit();
  }
}
