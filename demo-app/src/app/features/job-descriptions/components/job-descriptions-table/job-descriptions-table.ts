import { Component, input } from '@angular/core';
import { JobDescription } from '../../types/job-descriptions.type';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-job-descriptions-table',
  imports: [TableModule],
  templateUrl: './job-descriptions-table.html',
  styleUrl: './job-descriptions-table.scss',
})
export class JobDescriptionsTable {
  data = input.required<JobDescription[]>();
}
