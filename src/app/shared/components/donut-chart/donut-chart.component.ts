import { Component, Input } from '@angular/core';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutArc extends DonutSegment {
  dashArray: string;
  dashOffset: string;
}

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
})
export class DonutChartComponent {
  @Input({ required: true }) segments: DonutSegment[] = [];
  @Input() size = 160;
  @Input() strokeWidth = 16;

  readonly radius = RADIUS;

  get total(): number {
    return this.segments.reduce((sum, s) => sum + s.value, 0);
  }

  get arcs(): DonutArc[] {
    const total = this.total;
    if (total <= 0) return [];

    let cursor = 0;
    return this.segments
      .filter((s) => s.value > 0)
      .map((s) => {
        const length = (s.value / total) * CIRCUMFERENCE;
        const arc: DonutArc = {
          ...s,
          dashArray: `${length} ${CIRCUMFERENCE - length}`,
          dashOffset: `${-cursor}`,
        };
        cursor += length;
        return arc;
      });
  }
}
