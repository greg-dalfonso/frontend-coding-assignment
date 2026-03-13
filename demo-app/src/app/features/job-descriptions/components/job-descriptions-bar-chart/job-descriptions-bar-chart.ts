import { Component, computed, EventEmitter, input, Output, signal } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { brandColor } from '../../../../theme.constants';

export interface MonthCount {
  month: number;
  year: number;
  count: number;
}

export const barColorDefault = 'rgb(175, 214, 218)';
export const barColorActive = brandColor;

@Component({
  selector: 'app-job-descriptions-bar-chart',
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts: () => import('echarts') })],
  templateUrl: './job-descriptions-bar-chart.html',
  styleUrl: './job-descriptions-bar-chart.scss',
})
export class JobDescriptionsBarChart {
  data = input.required<MonthCount[]>();
  @Output() barClicked: EventEmitter<number> = new EventEmitter();

  private activeIndex = signal<number | null>(null);

  // Hover effects do not work reliably on touch devices. Sometimes the 'touchleave' event is not triggered,
  // causing 2 bars to appear active at the same time. To avoid this we disable emphasis on touch devices,
  // so bars will only be highlighted when clicked.
  private readonly isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  private readonly formatMonth = new Intl.DateTimeFormat('default', {
    month: 'short',
    year: 'numeric',
  });

  protected chartOptions = computed((): EChartsOption => {
    const data = this.data();
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) =>
          `<div style="font-weight:600;margin-bottom:4px">${params.name}</div>` +
          `<div> Job Descriptions: <b>${params.value}</b></div>`,
      },
      legend: {
        show: true,
        top: 0,
        data: [{ name: '# of Job Descriptions', itemStyle: { color: barColorDefault } }],
        selectedMode: false,
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          startValue: Math.max(0, data.length - 12),
          endValue: data.length - 1,
          bottom: 16,
          brushSelect: false,
          labelFormatter: () => '',
        },
        { type: 'inside', xAxisIndex: 0, zoomLock: true },
      ],
      grid: { left: 40, right: 16, top: 36, bottom: 125 },
      xAxis: {
        type: 'category',
        data: data.map(({ month, year }) => this.formatMonth.format(new Date(year, month))),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { rotate: 45, cursor: 'pointer' } as object,
        triggerEvent: true,
      },
      yAxis: { type: 'value', splitLine: { show: true }, minInterval: 1 },
      series: [
        {
          name: '# of Job Descriptions',
          type: 'bar',
          data: data.map(({ count }) => ({
            value: count,
            itemStyle: { color: barColorDefault },
          })),
          emphasis: { disabled: this.isTouchDevice, itemStyle: { color: barColorActive } },
          cursor: 'pointer',
        },
      ],
    };
  });

  // Partial update applied via [merge] to highlight the active bar without
  // triggering a full chart re-render (which would reset the dataZoom position).
  protected activeSeriesColors = computed(
    (): EChartsOption => ({
      series: [
        {
          data: this.data().map(({ count }, i) => ({
            value: count,
            itemStyle: { color: i === this.activeIndex() ? barColorActive : barColorDefault },
          })),
        },
      ],
    })
  );

  protected onChartClick(event: { dataIndex: number }): void {
    if (event.dataIndex === undefined) return;
    this.activeIndex.set(event.dataIndex);
    this.barClicked.emit(event.dataIndex);
  }
}
