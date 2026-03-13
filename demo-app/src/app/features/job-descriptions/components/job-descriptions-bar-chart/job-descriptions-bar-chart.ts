import { Component, computed, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { ChartModule, UIChart } from 'primeng/chart';
import { ChartData, ChartOptions } from 'chart.js';

export interface MonthCount {
  month: number;
  year: number;
  count: number;
}

const barColorDefault = 'rgb(175, 214, 218)';
const barColorActive = 'rgb(78, 157, 168)';

@Component({
  selector: 'app-job-descriptions-bar-chart',
  imports: [ChartModule],
  templateUrl: './job-descriptions-bar-chart.html',
  styleUrl: './job-descriptions-bar-chart.scss',
})
export class JobDescriptionsBarChart {
  @ViewChild(UIChart) private chartRef!: UIChart;
  data = input.required<MonthCount[]>();
  @Output() barClicked: EventEmitter<number> = new EventEmitter();

  private activeIndex: number | null = null;

  protected readonly chartOptions: ChartOptions<'bar'> = {
    onHover: (event: any, elements: any[]) => {
      const hoveredIndex = elements[0]?.index;
      const isActive = hoveredIndex !== undefined && hoveredIndex === this.activeIndex;
      event.native.target.style.cursor = elements.length && !isActive ? 'pointer' : 'default';
    },
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}`,
        },
      },
      legend: {
        display: true,
        position: 'bottom',
        onClick: () => {},
        labels: {
          generateLabels: () => [
            {
              text: '# of Job Descriptions',
              fillStyle: barColorDefault,
              strokeStyle: barColorDefault,
            },
          ],
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
    },
  };

  protected chartData = computed((): ChartData<'bar'> => {
    // Using this to get month names for the user's current locale. Overkill for this demo app
    // but something I would consider for production application with international users.
    const formatMonth = new Intl.DateTimeFormat('default', { month: 'short', year: 'numeric' });

    return {
      labels: this.data().map(({ month, year }) => formatMonth.format(new Date(year, month))),
      datasets: [{ data: this.data().map(({ count }) => count), backgroundColor: barColorDefault }],
    };
  });

  protected onBarClick(event: { element: { index: number } }): void {
    const index = event.element.index;
    this.activeIndex = index;
    this.barClicked.emit(index);

    // Update colors directly on the Chart.js instance to avoid re-rendering the chart.
    this.chartRef.chart.data.datasets[0].backgroundColor = this.data().map((_, i) =>
      i === index ? barColorActive : barColorDefault
    );
    this.chartRef.chart.update('none');
  }
}
