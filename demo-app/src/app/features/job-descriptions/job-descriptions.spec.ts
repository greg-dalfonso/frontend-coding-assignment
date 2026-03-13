import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { JobDescriptions } from './job-descriptions';
import { JobDescriptionApiResponse } from './types/job-descriptions.type';

const API_URL = 'https://dsg-api-test.k2-app.com/ats/search/all';

const mockResponse: JobDescriptionApiResponse = {
  count: 2,
  searches: [
    {
      websiteTitle: 'Software Engineer',
      websiteOrganization: 'Acme Corp',
      websiteLocation: 'New York',
      websiteDatePublished: '2025-03-15T12:00:00.000+0000',
    },
    {
      websiteTitle: 'Product Manager',
      websiteOrganization: 'Tech Co',
      websiteLocation: 'Remote',
      websiteDatePublished: '2025-03-20T12:00:00.000+0000',
    },
  ],
};

const emptyResponse: JobDescriptionApiResponse = { count: 0, searches: [] };

describe('JobDescriptions', () => {
  let component: JobDescriptions;
  let fixture: ComponentFixture<JobDescriptions>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDescriptions],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(JobDescriptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
    httpTesting.expectOne(API_URL).flush(mockResponse);
  });

  describe('loading state', () => {
    it('shows the loading spinner while the request is in flight', () => {
      const spinner = fixture.nativeElement.querySelector('p-progress-spinner');
      expect(spinner).toBeTruthy();
      httpTesting.expectOne(API_URL).flush(mockResponse);
    });

    it('hides the spinner after a successful response', () => {
      httpTesting.expectOne(API_URL).flush(mockResponse);
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector('p-progress-spinner');
      expect(spinner).toBeNull();
    });
  });

  describe('success state', () => {
    beforeEach(() => {
      httpTesting.expectOne(API_URL).flush(mockResponse);
      fixture.detectChanges();
    });

    it('renders the bar chart when data is present', () => {
      const chart = fixture.nativeElement.querySelector('app-job-descriptions-bar-chart');
      expect(chart).toBeTruthy();
    });

    it('shows the table placeholder before a bar is selected', () => {
      const placeholder = fixture.nativeElement.querySelector('.table-placeholder');
      expect(placeholder).toBeTruthy();
    });

    it('shows the table after a bar is clicked', () => {
      (component as any).monthSelected.set(0);
      fixture.detectChanges();
      const table = fixture.nativeElement.querySelector('app-job-descriptions-table');
      expect(table).toBeTruthy();
    });
  });

  describe('empty state', () => {
    it('shows "No Results found." when the response has no searches', () => {
      httpTesting.expectOne(API_URL).flush(emptyResponse);
      fixture.detectChanges();
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('No Results found.');
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      httpTesting.expectOne(API_URL).flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
      fixture.detectChanges();
    });

    it('shows the error message', () => {
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Failed to load job descriptions');
    });

    it('shows the Try Again button', () => {
      const button = fixture.nativeElement.querySelector('p-button');
      expect(button).toBeTruthy();
    });

    it('retries the request when Try Again is clicked', () => {
      (component as any).loadData();
      fixture.detectChanges();
      httpTesting.expectOne(API_URL).flush(mockResponse);
    });
  });
});
