export interface JobDescriptionApiResponse {
  count: number;
  searches: JobDescription[];
}

export interface JobDescription {
  websiteTitle: string;
  websiteLocation: string;
  websiteOrganization: string;
  websiteDatePublished: string;
}

export interface JobDescriptionFilter {
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

export interface MonthCount {
  month: number;
  count: number;
}
