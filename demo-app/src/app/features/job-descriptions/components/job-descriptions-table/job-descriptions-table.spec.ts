import { ComponentFixture, TestBed } from '@angular/core/testing';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { JobDescriptionsTable } from './job-descriptions-table';
import { JobDescription } from '../../types/job-descriptions.type';
import { provideZonelessChangeDetection } from '@angular/core';

const mockJobs: JobDescription[] = [
  {
    websiteTitle: 'Software Engineer',
    websiteOrganization: 'Acme Corp',
    websiteLocation: 'New York',
    websiteDatePublished: '15-Jan-2025',
    websiteDatePublishedRaw: '2025-01-15',
  },
  {
    websiteTitle: 'Product Manager',
    websiteOrganization: 'Tech Co',
    websiteLocation: 'Remote',
    websiteDatePublished: '20-Feb-2025',
    websiteDatePublishedRaw: '2025-02-20',
  },
];

describe('JobDescriptionsTable', () => {
  let component: JobDescriptionsTable;
  let fixture: ComponentFixture<JobDescriptionsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobDescriptionsTable],
      providers: [provideZonelessChangeDetection(), providePrimeNG({ theme: { preset: Aura } })],
    }).compileComponents();

    fixture = TestBed.createComponent(JobDescriptionsTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockJobs);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the correct number of rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(mockJobs.length);
  });

  it('displays all column headers', () => {
    const headers: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('th'));
    const text = headers.map((h) => h.textContent!.trim());
    expect(text.some((t) => t.includes('Title'))).toBeTrue();
    expect(text.some((t) => t.includes('Organization'))).toBeTrue();
    expect(text.some((t) => t.includes('Location'))).toBeTrue();
    expect(text.some((t) => t.includes('Date Published'))).toBeTrue();
  });

  it('displays job data in each row', () => {
    const rows: HTMLTableRowElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('tbody tr')
    );
    const cellValues = rows.flatMap((row) =>
      Array.from(row.querySelectorAll('td')).map((td) => td.textContent!.trim())
    );
    expect(cellValues).toContain('Software Engineer');
    expect(cellValues).toContain('Acme Corp');
    expect(cellValues).toContain('New York');
    expect(cellValues).toContain('15-Jan-2025');
  });

  it('shows the correct row count in the summary footer', () => {
    const footer = fixture.nativeElement.querySelector('.footer');
    expect(footer.textContent).toContain(
      `Displaying ${mockJobs.length} of ${mockJobs.length} rows`
    );
  });

  it('updates the footer count when data changes', () => {
    fixture.componentRef.setInput('data', [mockJobs[0]]);
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('.footer');
    expect(footer.textContent).toContain('Displaying 1 of 1 rows');
  });

  it('shows "No results found." when data is empty', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    const cells: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('tbody td'));
    expect(cells.some((td) => td.textContent?.trim() === 'No results found.')).toBeTrue();
  });

  it('scrolls to top when data changes', () => {
    const table = (component as any).table;
    const scrollSpy = spyOn(table, 'scrollTo');
    fixture.componentRef.setInput('data', [mockJobs[0]]);
    fixture.detectChanges();
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, left: 0 });
  });
});
