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

export interface JobDescriptionsByMonth {
  [month: number]: { jobDescriptions: JobDescription[] };
}
