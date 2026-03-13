import { Component, computed, DestroyRef, signal } from '@angular/core';
import { JobDescriptionsBarChart } from './components/job-descriptions-bar-chart/job-descriptions-bar-chart';
import { JobDescriptionsTable } from './components/job-descriptions-table/job-descriptions-table';
import { HttpClient } from '@angular/common/http';
import { JobDescriptionApiResponse, MonthGroup } from './types/job-descriptions.type';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Button } from 'primeng/button';
import { NgStyle } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toJobDescriptionsByMonth } from './utils/job-descriptions.util';

type JobDescriptionsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'done'; data: MonthGroup[] };

@Component({
  selector: 'app-job-descriptions',
  imports: [JobDescriptionsBarChart, JobDescriptionsTable, ProgressSpinner, Button, NgStyle],
  templateUrl: './job-descriptions.html',
  styleUrl: './job-descriptions.scss',
})
export class JobDescriptions {
  protected state = signal<JobDescriptionsState>({ status: 'loading' });
  protected monthSelected = signal<number | null>(null);

  private response = computed(() => {
    const state = this.state();
    return state.status === 'done' ? state.data : null;
  });

  protected monthCounts = computed(
    () =>
      this.response()?.map(({ month, year, jobDescriptions }) => ({
        month,
        year,
        count: jobDescriptions.length,
      })) ?? []
  );

  protected hasData = computed(() => this.monthCounts().some(({ count }) => count > 0));

  protected selectedJobs = computed(() => {
    const i = this.monthSelected();
    return i !== null ? (this.response()?.[i]?.jobDescriptions ?? []) : [];
  });

  constructor(
    private httpClient: HttpClient,
    private destroyRef: DestroyRef
  ) {
    this.loadData();
  }

  loadData(): void {
    this.state.set({ status: 'loading' });

    this.httpClient
      // In a production application I would use an environment variable for the base URL.
      .get<JobDescriptionApiResponse>('https://dsg-api-test.k2-app.com/ats/search/all')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.state.set({ status: 'done', data: toJobDescriptionsByMonth(response) });
        },
        error: (error) => {
          // If we had a logging service, I would log to the service here.
          console.error('Error loading job descriptions:', error);

          // If we support multiple languages I would localize user facing error messages.
          this.state.set({
            status: 'error',
            message: 'Failed to load job descriptions. Please try again.',
          });
        },
      });
  }
}
