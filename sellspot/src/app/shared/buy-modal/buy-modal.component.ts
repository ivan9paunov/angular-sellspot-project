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
  @Output() confirmModal = new EventEmitter<string>();
  @Input() gameName: string = '';
  @Input() seller: string = '';

  onClose() {
    this.closeModal.emit();
  }

  onConfirm(input: HTMLTextAreaElement) {
    const inputValue = input.value.trim();

    if (!inputValue) {
      return;
    }

    this.confirmModal.emit(inputValue);
  }
}
