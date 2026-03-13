/** Raw response shape from the job descriptions API. */
export interface JobDescriptionApiResponse {
  count: number;
  searches: ApiJobDescription[];
}

/** A single job description as returned by the API. */
export interface ApiJobDescription {
  websiteTitle: string;
  websiteLocation: string;
  websiteOrganization: string;
  websiteDatePublished: string;
}

export interface JobDescription extends ApiJobDescription {
  // Locale-formatted date string for display (e.g. "15-Jan-2025").
  websiteDatePublished: string;
  // Original ISO date string preserved for accurate sorting and timezone conversion.
  websiteDatePublishedRaw: string;
}

/** A calendar month with all job descriptions published in that month. */
export interface MonthGroup {
  month: number; // 0-indexed, matches Date.getMonth()
  year: number;
  jobDescriptions: JobDescription[];
}