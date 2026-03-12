import { Component, computed, DestroyRef, signal } from '@angular/core';
import { JobDescriptionsBarChart } from './components/job-descriptions-bar-chart/job-descriptions-bar-chart';
import { JobDescriptionsTable } from './components/job-descriptions-table/job-descriptions-table';
import { HttpClient } from '@angular/common/http';
import { mockJobDescriptions } from './mocks/job-descriptions.mock';
import { JobDescriptionsByMonth } from './types/job-descriptions.type';
import { toJobDescriptionsByMonth } from './utils/job-descriptions.util';

type JobDescriptionsState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'done'; response: JobDescriptionsByMonth };

@Component({
  selector: 'app-job-descriptions',
  imports: [JobDescriptionsBarChart, JobDescriptionsTable],
  templateUrl: './job-descriptions.html',
  styleUrl: './job-descriptions.scss',
})
export class JobDescriptions {
  protected state = signal<JobDescriptionsState>({ status: 'loading' });
  protected monthSelected = signal<number | null>(null);

  private response = computed(() => {
    const state = this.state();
    return state.status === 'done' ? state.response : null;
  });

  protected monthCounts = computed(() => {
    const response = this.response();
    if (!response) return [];
    return Array.from({ length: 12 }, (_, month) => ({
      month,
      count: response[month]?.jobDescriptions.length ?? 0,
    }));
  });

  protected hasData = computed(() => this.monthCounts().some(({ count }) => count > 0));

  protected selectedJobs = computed(() => {
    const month = this.monthSelected();
    return month !== null ? (this.response()?.[month]?.jobDescriptions ?? []) : [];
  });

  constructor(
    private httpClient: HttpClient,
    private destroyRef: DestroyRef
  ) {
    this.loadData();
  }

  loadData(): void {
    this.state.set({ status: 'loading' });

    // TODO: Uncomment. Using mock data to prevent constantly pinging the API while developing the UI.
    setTimeout(() => {
      this.state.set({
        status: 'done',
        response: toJobDescriptionsByMonth(mockJobDescriptions),
      });
    }, 500);

    // this.httpClient
    //   // In a production application I would use an environment variable for the base URL.
    //   .get<JobDescriptionApiResponse>('https://dsg-api-test.k2-app.com/ats/search/all')
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: (response) => {
    //       this.data.set({ state: 'done', data: categorizeJobDescriptionApiResponse(response) });
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
