import { Component, Input } from '@angular/core';

export interface BarSegment {
  value: number;
  color: string;
}

export interface BarItem {
  label: string;
  segments: BarSegment[];
}

export interface BarLegendEntry {
  label: string;
  color: string;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent {
  @Input({ required: true }) items: BarItem[] = [];
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() valueFormatter: (value: number) => string = (v) => String(v);
  @Input() legend?: BarLegendEntry[];
  @Input() height = 220;

  get maxTotal(): number {
    return Math.max(...this.items.map((item) => this.totalOf(item)), 1);
  }

  totalOf(item: BarItem): number {
    return item.segments.reduce((sum, seg) => sum + seg.value, 0);
  }

  stackSizePercent(item: BarItem): number {
    return (this.totalOf(item) / this.maxTotal) * 100;
  }

  tooltipFor(item: BarItem): string {
    return `${item.label}: ${this.valueFormatter(this.totalOf(item))}`;
  }
}
