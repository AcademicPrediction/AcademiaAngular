import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-prediction-dialog',
  templateUrl: './prediction-dialog.component.html',
  styleUrls: ['./prediction-dialog.component.css'],
})
export class PredictionDialogComponent {
  @Input() showDialog!: boolean;
  @Output() closeDialogEvent = new EventEmitter<void>();

  constructor() {}

  closeDialog() {
    this.closeDialogEvent.emit();
    this.showDialog = false;
  }
}
