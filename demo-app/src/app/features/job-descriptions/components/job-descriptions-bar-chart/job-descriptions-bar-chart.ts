import { Component, computed, input } from '@angular/core';
import { JobDescription } from '../../job-descriptions.type';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-job-descriptions-bar-chart',
  imports: [JsonPipe],
  templateUrl: './job-descriptions-bar-chart.html',
  styleUrl: './job-descriptions-bar-chart.scss',
})
export class JobDescriptionsBarChart {
  jobDescriptions = input.required<JobDescription[]>();

  countsByMonth = computed(() => {
    const countByMonth = new Map<number, number>();

    for (const job of this.jobDescriptions()) {
      const month = new Date(job.websiteDatePublished).getMonth() + 1;
      countByMonth.set(month, (countByMonth.get(month) ?? 0) + 1);
    }

    return [...countByMonth.entries()]
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month - b.month);
  });
}
