import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() buttonType: string = 'button';
  @Output() action = new EventEmitter<void>();

  onClick(): void {
    this.action.emit();
  }
}
