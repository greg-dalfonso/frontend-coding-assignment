import { Component, computed, EventEmitter, input, Output, signal } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

export interface MonthCount {
  month: number;
  year: number;
  count: number;
}

const barColorDefault = 'rgb(175, 214, 218)';
const barColorActive = 'rgb(78, 157, 168)';

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
        bottom: 0,
        data: [{ name: '# of Job Descriptions', itemStyle: { color: barColorDefault } }],
        selectedMode: false,
      },
      grid: { left: 40, right: 16, top: 16, bottom: 100 },
      xAxis: {
        type: 'category',
        data: data.map(({ month, year }) => this.formatMonth.format(new Date(year, month))),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { rotate: 45, cursor: 'pointer' } as object,
        triggerEvent: true,
      },
      yAxis: { type: 'value', splitLine: { show: true } },
      series: [
        {
          name: '# of Job Descriptions',
          type: 'bar',
          data: data.map(({ count }, i) => ({
            value: count,
            itemStyle: { color: i === this.activeIndex() ? barColorActive : barColorDefault },
          })),
          emphasis: { itemStyle: { color: barColorActive } },
          cursor: 'pointer',
        },
      ],
    };
  });

  protected onChartClick(event: { dataIndex: number }): void {
    if (event.dataIndex === undefined) return;
    this.activeIndex.set(event.dataIndex);
    this.barClicked.emit(event.dataIndex);
  }
}
