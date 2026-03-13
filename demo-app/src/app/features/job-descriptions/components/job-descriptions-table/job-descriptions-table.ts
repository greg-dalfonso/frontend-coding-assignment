import { Component, effect, input, ViewChild } from '@angular/core';
import { JobDescription } from '../../types/job-descriptions.type';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-job-descriptions-table',
  imports: [TableModule],
  templateUrl: './job-descriptions-table.html',
  styleUrl: './job-descriptions-table.scss',
})
export class JobDescriptionsTable {
  @ViewChild(Table) private table!: Table;
  data = input.required<JobDescription[]>();

  constructor() {
    effect(() => {
      this.data();
      this.table?.scrollTo({ top: 0 });
    });
  }
}
