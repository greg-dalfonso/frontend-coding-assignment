export interface JobDescriptionApiResponse {
  count: number;
  searches: ApiJobDescription[];
}

export interface ApiJobDescription {
  websiteTitle: string;
  websiteLocation: string;
  websiteOrganization: string;
  websiteDatePublished: string;
}

export interface JobDescription extends ApiJobDescription {
  websiteDatePublishedRaw: string;
}

export interface MonthGroup {
  month: number; // 0-indexed, matches Date.getMonth()
  year: number;
  jobDescriptions: JobDescription[];
}
