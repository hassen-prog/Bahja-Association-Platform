import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-join-interest-dialog',
  template: `
    <h1 mat-dialog-title>Choose An Action</h1>
    <div mat-dialog-content>
      <p>Do you want to join the meeting or mark as interested for now ?</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="close('interested')">Interested</button>
      <button mat-button color="primary" (click)="close('join')">Join</button>
    </div>
  `,
})
export class JoinInterestDialogComponent {
  constructor(private dialogRef: MatDialogRef<JoinInterestDialogComponent>) {}

  close(choice: string) {
    this.dialogRef.close(choice);
  }
}
