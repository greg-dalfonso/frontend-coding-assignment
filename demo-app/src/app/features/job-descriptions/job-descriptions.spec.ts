import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { JobDescriptions } from './job-descriptions';

describe('JobDescriptions', () => {
  let component: JobDescriptions;
  let fixture: ComponentFixture<JobDescriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDescriptions],
      providers: [provideZonelessChangeDetection(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(JobDescriptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
