import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

// Explicit extension point for the Billing pass — matches the layout slot and jobId input
// contract React's <BillPanel jobId={...}> occupies, so Billing can drop in later without
// reshaping the detail page.
@Component({
  selector: 'app-bill-panel-placeholder',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title class="panel-title">Billing</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p class="history-meta">Billing — coming in a later pass.</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class BillPanelPlaceholderComponent {
  @Input({ required: true }) jobId!: string;
}
