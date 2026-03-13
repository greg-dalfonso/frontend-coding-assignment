import { JobDescriptionApiResponse, MonthGroup } from '../types/job-descriptions.type';

/**
 * Maps the JobDescriptionApiResponse to a sorted MonthGroup array spanning the full
 * date range of the data, with empty arrays for months that have no job descriptions.
 * Accepts an optional date formatter, otherwise it defaults to normalizing the date
 * for user locale.
 */
export function toJobDescriptionsByMonth(
  res: JobDescriptionApiResponse,
  formatDate = new Intl.DateTimeFormat('default', { dateStyle: 'medium' })
): MonthGroup[] {
  const grouped = new Map<number, MonthGroup>();

  for (const job of res.searches) {
    const date = new Date(job.websiteDatePublished);
    const year = date.getFullYear();
    const month = date.getMonth();
    const ordinal = toOrdinal(year, month);

    if (!grouped.has(ordinal)) {
      grouped.set(ordinal, { year, month, jobDescriptions: [] });
    }

    grouped.get(ordinal)!.jobDescriptions.push({
      ...job,
      websiteDatePublished: formatDate.format(date),
      websiteDatePublishedRaw: job.websiteDatePublished,
    });
  }

  if (!grouped.size) return [];

  const ordinals = Array.from(grouped.keys());
  const min = Math.min(...ordinals);
  const max = Math.max(...ordinals);

  return Array.from({ length: max - min + 1 }, (_, i) => {
    const ordinal = min + i;
    const year = Math.floor(ordinal / 12);
    const month = ordinal % 12;
    return grouped.get(ordinal) ?? { year, month, jobDescriptions: [] };
  });
}

function toOrdinal(year: number, month: number): number {
  return year * 12 + month;
}