import { JobDescriptionApiResponse, JobDescriptionsByMonth } from '../types/job-descriptions.type';

/**
 * Maps the JobDescriptionApiResponse to JobDescriptionsByMonth
 * Accepts an optional date formatter, otherwise it defaults to normalizing the date
 * for user locale.
 */
export function toJobDescriptionsByMonth(
  res: JobDescriptionApiResponse,
  formatDate = new Intl.DateTimeFormat('default', { dateStyle: 'medium' })
): JobDescriptionsByMonth {
  const result: JobDescriptionsByMonth = {};

  for (const job of res.searches) {
    const date = new Date(job.websiteDatePublished);
    const month = date.getMonth();

    if (!result[month]) {
      result[month] = { jobDescriptions: [] };
    }

    result[month].jobDescriptions.push({
      ...job,
      websiteDatePublished: formatDate.format(date),
    });
  }

  return result;
}
