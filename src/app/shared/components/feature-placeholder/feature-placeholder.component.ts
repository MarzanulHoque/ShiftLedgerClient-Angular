import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feature-placeholder',
  standalone: true,
  template: `
    <div class="feature-placeholder">
      <h2>{{ title }}</h2>
      <p>Coming in a later pass.</p>
    </div>
  `,
  styles: [
    `
      .feature-placeholder {
        padding: 2rem;
        text-align: center;
        color: var(--mat-sys-on-surface-variant, #666);
      }
    `,
  ],
})
export class FeaturePlaceholderComponent {
  @Input() title = '';
}
