import { toJobDescriptionsByMonth } from './job-descriptions.util';
import { JobDescriptionApiResponse } from '../types/job-descriptions.type';

// Use a fixed formatter so tests aren't locale-dependent
const fixedFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

// Matches the real API format: midnight UTC with +0000 offset.
// Using mid-month dates avoids month-boundary edge cases with timezone conversion.
function apiDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T12:00:00.000+0000`;
}

function makeResponse(...dates: string[]): JobDescriptionApiResponse {
  return {
    count: dates.length,
    searches: dates.map((date, i) => ({
      websiteTitle: `Job ${i + 1}`,
      websiteLocation: 'Location',
      websiteOrganization: 'Org',
      websiteDatePublished: date,
    })),
  };
}

describe('toJobDescriptionsByMonth', () => {
  it('returns empty array when there are no searches', () => {
    const result = toJobDescriptionsByMonth({ count: 0, searches: [] }, fixedFormatter);
    expect(result).toEqual([]);
  });

  it('groups a single job into the correct month and year', () => {
    const result = toJobDescriptionsByMonth(makeResponse(apiDate(2025, 1, 15)), fixedFormatter);
    expect(result.length).toBe(1);
    expect(result[0].year).toBe(2025);
    expect(result[0].month).toBe(0); // January is 0-indexed
    expect(result[0].jobDescriptions.length).toBe(1);
  });

  it('groups multiple jobs in the same month together', () => {
    const result = toJobDescriptionsByMonth(
      makeResponse(apiDate(2025, 3, 1), apiDate(2025, 3, 15), apiDate(2025, 3, 28)),
      fixedFormatter
    );
    expect(result.length).toBe(1);
    expect(result[0].jobDescriptions.length).toBe(3);
  });

  it('returns months sorted chronologically', () => {
    const result = toJobDescriptionsByMonth(
      makeResponse(apiDate(2025, 3, 15), apiDate(2025, 1, 15), apiDate(2025, 2, 15)),
      fixedFormatter
    );
    expect(result.map((g) => g.month)).toEqual([0, 1, 2]);
  });

  it('fills gaps between months with empty job description arrays', () => {
    const result = toJobDescriptionsByMonth(
      makeResponse(apiDate(2025, 1, 15), apiDate(2025, 4, 15)),
      fixedFormatter
    );
    expect(result.length).toBe(4); // Jan, Feb, Mar, Apr
    expect(result[1].jobDescriptions).toEqual([]); // Feb — gap
    expect(result[2].jobDescriptions).toEqual([]); // Mar — gap
  });

  it('fills gaps across a year boundary', () => {
    const result = toJobDescriptionsByMonth(
      makeResponse(apiDate(2024, 11, 15), apiDate(2025, 2, 15)),
      fixedFormatter
    );
    expect(result.length).toBe(4); // Nov 2024, Dec 2024, Jan 2025, Feb 2025
    expect(result[0]).toEqual(jasmine.objectContaining({ year: 2024, month: 10 }));
    expect(result[1]).toEqual(jasmine.objectContaining({ year: 2024, month: 11 }));
    expect(result[2]).toEqual(jasmine.objectContaining({ year: 2025, month: 0 }));
    expect(result[3]).toEqual(jasmine.objectContaining({ year: 2025, month: 1 }));
  });

  it('preserves the raw ISO date string in websiteDatePublishedRaw', () => {
    const isoDate = apiDate(2025, 6, 15);
    const result = toJobDescriptionsByMonth(makeResponse(isoDate), fixedFormatter);
    expect(result[0].jobDescriptions[0].websiteDatePublishedRaw).toBe(isoDate);
  });

  it('formats websiteDatePublished using the provided formatter', () => {
    const isoDate = apiDate(2025, 6, 15);
    const expected = fixedFormatter.format(new Date(isoDate));
    const result = toJobDescriptionsByMonth(makeResponse(isoDate), fixedFormatter);
    expect(result[0].jobDescriptions[0].websiteDatePublished).toBe(expected);
  });
});