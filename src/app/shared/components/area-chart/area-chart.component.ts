import { Component, Input } from '@angular/core';

export interface AreaChartPoint {
  label: string;
  value: number;
}

interface PlottedPoint extends AreaChartPoint {
  x: number;
  y: number;
}

const VIEWBOX_WIDTH = 300;
const VIEWBOX_HEIGHT = 100;
const TOP_PADDING = 6;
const BOTTOM_PADDING = 6;

@Component({
  selector: 'app-area-chart',
  standalone: true,
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.scss',
})
export class AreaChartComponent {
  @Input({ required: true }) points: AreaChartPoint[] = [];
  @Input() height = 220;
  @Input() valueFormatter: (value: number) => string = (v) => String(v);
  @Input() labelFormatter: (label: string) => string = (l) => l;

  readonly viewBoxWidth = VIEWBOX_WIDTH;
  readonly viewBoxHeight = VIEWBOX_HEIGHT;

  private get plotted(): PlottedPoint[] {
    const n = this.points.length;
    if (n === 0) return [];
    const max = Math.max(...this.points.map((p) => p.value), 0);
    const usableHeight = VIEWBOX_HEIGHT - TOP_PADDING - BOTTOM_PADDING;

    return this.points.map((p, i) => ({
      ...p,
      x: n === 1 ? VIEWBOX_WIDTH / 2 : (i / (n - 1)) * VIEWBOX_WIDTH,
      y: max === 0 ? VIEWBOX_HEIGHT - BOTTOM_PADDING : VIEWBOX_HEIGHT - BOTTOM_PADDING - (p.value / max) * usableHeight,
    }));
  }

  get maxValue(): number {
    return Math.max(...this.points.map((p) => p.value), 0);
  }

  get linePath(): string {
    const pts = this.plotted;
    if (pts.length === 0) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }

  get areaPath(): string {
    const pts = this.plotted;
    if (pts.length === 0) return '';
    const baseline = VIEWBOX_HEIGHT - BOTTOM_PADDING;
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return `${line} L ${pts[pts.length - 1].x} ${baseline} L ${pts[0].x} ${baseline} Z`;
  }

  get markers(): PlottedPoint[] {
    return this.plotted;
  }

  get firstLabel(): string {
    return this.points.length > 0 ? this.labelFormatter(this.points[0].label) : '';
  }

  get lastLabel(): string {
    return this.points.length > 0 ? this.labelFormatter(this.points[this.points.length - 1].label) : '';
  }
}
