import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDescriptionsTable } from './job-descriptions-table';

describe('JobDescriptionsTable', () => {
  let component: JobDescriptionsTable;
  let fixture: ComponentFixture<JobDescriptionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDescriptionsTable],
    }).compileComponents();

    fixture = TestBed.createComponent(JobDescriptionsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
