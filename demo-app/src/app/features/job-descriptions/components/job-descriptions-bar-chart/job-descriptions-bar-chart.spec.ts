import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDescriptionsBarChart } from './job-descriptions-bar-chart';

describe('JobDescriptionsBarChart', () => {
  let component: JobDescriptionsBarChart;
  let fixture: ComponentFixture<JobDescriptionsBarChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDescriptionsBarChart],
    }).compileComponents();

    fixture = TestBed.createComponent(JobDescriptionsBarChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
