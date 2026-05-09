export interface Movie {
  id: string;           // imdbID e.g. "tt1234567"
  imdbID: string;
  title: string;
  overview: string;
  poster_path: string | null;   // full URL or null
  release_date: string;         // "YYYY-MM-DD" or "DD Mon YYYY"
  vote_average: number;         // 0–10 (IMDb rating)
  vote_count: number;
  popularity: number;           // always 0 for OMDb (unused in sort display)
}

export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type SortOption = 'release_date' | 'vote_average' | 'popularity' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface SearchFilters {
  query: string;
  page: number;
  sortBy: SortOption;
  sortDirection: SortDirection;
  minRating: number;
}
