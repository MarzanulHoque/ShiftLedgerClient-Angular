import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type StatTileColor = 'steel' | 'brand' | 'danger' | 'success';
export type GoodDirection = 'up' | 'down' | 'neutral';

interface Trend {
  label: string;
  tone: 'dimmed' | 'success' | 'danger';
  icon: 'arrow_forward' | 'arrow_upward' | 'arrow_downward';
}

@Component({
  selector: 'app-stat-tile',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './stat-tile.component.html',
  styleUrl: './stat-tile.component.scss',
})
export class StatTileComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) color: StatTileColor = 'steel';
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string;
  @Input() sub?: string;
  @Input() current?: number;
  @Input() previous?: number;
  @Input() goodDirection: GoodDirection = 'up';

  get trend(): Trend | null {
    const { current, previous } = this;
    if (current === undefined || previous === undefined) return null;
    if (previous === 0 && current === 0) return null;

    const diff = current - previous;
    const flat = diff === 0;
    const went = diff > 0 ? 'up' : 'down';
    const pct = previous !== 0 ? Math.round((diff / previous) * 100) : null;
    const label = flat ? 'No change' : pct === null ? `${diff > 0 ? '+' : ''}${diff}` : `${diff > 0 ? '+' : ''}${pct}%`;
    const isGood = flat || this.goodDirection === 'neutral' ? null : this.goodDirection === went;

    return {
      label,
      tone: isGood === null ? 'dimmed' : isGood ? 'success' : 'danger',
      icon: flat ? 'arrow_forward' : went === 'up' ? 'arrow_upward' : 'arrow_downward',
    };
  }
}
