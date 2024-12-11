import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-buy-modal',
  standalone: true,
  imports: [],
  templateUrl: './buy-modal.component.html',
  styleUrl: './buy-modal.component.css'
})
export class BuyModalComponent {
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
