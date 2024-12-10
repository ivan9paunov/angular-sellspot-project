import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-modal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './terms-modal.component.html',
  styleUrl: './terms-modal.component.css'
})
export class TermsModalComponent {
  @Output() closeModal = new EventEmitter<boolean>();

  onClose() {
    this.closeModal.emit();
  }
}
