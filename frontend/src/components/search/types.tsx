export interface SearchResult {
    id: number;
    title: string;
    city: string;
    description: string;
    employmentType: string;
    salaryMinimum: number;
    tags: string[];
    distance: number;
    sim: number;
  }