import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { JobDescriptionsBarChart } from './components/job-descriptions-bar-chart/job-descriptions-bar-chart';
import { JobDescriptionsTable } from './components/job-descriptions-table/job-descriptions-table';
import { HttpClient } from '@angular/common/http';
import { mockJobDescriptions } from './job-descriptions.mock';
import { JobDescriptionApiResponse } from './job-descriptions.type';

type JobDescriptionsState =
  | {
      state: 'loading';
    }
  | {
      state: 'error';
      error: string;
    }
  | {
      state: 'done';
      data: JobDescriptionApiResponse;
    };

@Component({
  selector: 'app-job-descriptions',
  imports: [JobDescriptionsBarChart, JobDescriptionsTable],
  templateUrl: './job-descriptions.html',
  styleUrl: './job-descriptions.scss',
})
export class JobDescriptions implements OnInit {
  protected data = signal<JobDescriptionsState>({ state: 'loading' });

  constructor(
    private httpClient: HttpClient,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.data.set({ state: 'loading' });

    // TODO: Uncomment. Using mock data to prevent constantly pinging the API while developing the UI.
    setTimeout(() => {
      this.data.set({
        state: 'done',
        data: mockJobDescriptions,
      });
    }, 3000);

    // this.httpClient
    //   // In a production application I would use an environment variable for the base URL.
    //   .get<JobDescriptionApiResponse>('https://dsg-api-test.k2-app.com/ats/search/all')
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: (response) => {
    //       this.data.set({ state: 'done', data: response });
    //     },
    //     error: (error) => {
    //       // If we had a logging service, I would log to the service here.
    //       console.error('Error loading job descriptions:', error);
    //
    //       // If we support multiple languages I would localize user facing error messages.
    //       this.data.set({ state: 'error', error: 'Failed to load job descriptions' });
    //     },
    //   });
  }
}
