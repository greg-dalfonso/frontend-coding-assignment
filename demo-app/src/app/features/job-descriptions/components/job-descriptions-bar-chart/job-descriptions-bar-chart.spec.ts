import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  barColorActive,
  barColorDefault,
  JobDescriptionsBarChart,
  MonthCount,
} from './job-descriptions-bar-chart';

const mockData: MonthCount[] = [
  { month: 0, year: 2025, count: 3 },
  { month: 1, year: 2025, count: 5 },
  { month: 2, year: 2025, count: 0 },
];

describe('JobDescriptionsBarChart', () => {
  let component: JobDescriptionsBarChart;
  let fixture: ComponentFixture<JobDescriptionsBarChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDescriptionsBarChart],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(JobDescriptionsBarChart);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('chartOptions', () => {
    it('generates x-axis labels from month and year', () => {
      const options = (component as any).chartOptions();
      const labels = options.xAxis.data as string[];
      expect(labels.length).toBe(3);
      // Verify labels are non-empty strings (locale-dependent format)
      labels.forEach((label: string) => expect(label.length).toBeGreaterThan(0));
    });

    it('sets dataZoom to show the last 12 items by default', () => {
      fixture.componentRef.setInput(
        'data',
        Array.from({ length: 15 }, (_, i) => ({
          month: i % 12,
          year: 2025 + Math.floor(i / 12),
          count: i,
        }))
      );
      fixture.detectChanges();
      const options = (component as any).chartOptions();
      expect(options.dataZoom[0].startValue).toBe(3);
      expect(options.dataZoom[0].endValue).toBe(14);
    });

    it('sets dataZoom startValue to 0 when data has 12 or fewer items', () => {
      const options = (component as any).chartOptions();
      expect(options.dataZoom[0].startValue).toBe(0);
      expect(options.dataZoom[0].endValue).toBe(2);
    });

    it('maps series data to counts', () => {
      const options = (component as any).chartOptions();
      const seriesData = options.series[0].data;
      expect(seriesData[0].value).toBe(3);
      expect(seriesData[1].value).toBe(5);
      expect(seriesData[2].value).toBe(0);
    });
  });

  describe('activeSeriesColors', () => {
    it('highlights the active bar and resets others to default color', () => {
      (component as any).activeIndex.set(1);
      const colors = (component as any).activeSeriesColors();
      const data = colors.series[0].data;
      expect(data[0].itemStyle.color).toBe(barColorDefault);
      expect(data[1].itemStyle.color).toBe(barColorActive);
      expect(data[2].itemStyle.color).toBe(barColorDefault);
    });

    it('uses default color for all bars when no bar is active', () => {
      const colors = (component as any).activeSeriesColors();
      colors.series[0].data.forEach((d: any) => {
        expect(d.itemStyle.color).toBe(barColorDefault);
      });
    });
  });

  describe('onChartClick', () => {
    it('emits barClicked with the clicked index', () => {
      const emitted: number[] = [];
      component.barClicked.subscribe((i) => emitted.push(i));
      (component as any).onChartClick({ dataIndex: 1 });
      expect(emitted).toEqual([1]);
    });

    it('sets the active index on click', () => {
      (component as any).onChartClick({ dataIndex: 2 });
      expect((component as any).activeIndex()).toBe(2);
    });

    it('ignores click events with no dataIndex', () => {
      const emitted: number[] = [];
      component.barClicked.subscribe((i) => emitted.push(i));
      (component as any).onChartClick({} as any);
      expect(emitted).toEqual([]);
    });
  });
});
