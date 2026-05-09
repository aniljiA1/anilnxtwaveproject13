import axios from 'axios';
import type { Movie, MovieSearchResponse } from '../types/movie';

const BASE_URL = 'https://www.omdbapi.com';

const apiClient = axios.create({ baseURL: BASE_URL });

// OMDb raw search result shape
interface OmdbSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface OmdbSearchResponse {
  Search?: OmdbSearchResult[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

interface OmdbMovieDetail {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Genre: string;
  Director: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  imdbVotes: string;
  Response: string;
}

// Map OMDb result → internal Movie shape
const mapSearchResult = (item: OmdbSearchResult): Movie => ({
  id: item.imdbID,
  title: item.Title,
  overview: '',
  poster_path: item.Poster !== 'N/A' ? item.Poster : null,
  release_date: item.Year ? `${item.Year}-01-01` : '',
  vote_average: 0,
  vote_count: 0,
  popularity: 0,
  imdbID: item.imdbID,
});

const mapDetail = (d: OmdbMovieDetail): Partial<Movie> => ({
  overview: d.Plot !== 'N/A' ? d.Plot : '',
  vote_average: d.imdbRating !== 'N/A' ? parseFloat(d.imdbRating) : 0,
  vote_count: d.imdbVotes !== 'N/A' ? parseInt(d.imdbVotes.replace(/,/g, ''), 10) : 0,
  release_date: d.Released !== 'N/A' ? d.Released : `${d.Year}-01-01`,
});

const PAGE_SIZE = 10; // OMDb returns 10 per page

export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<MovieSearchResponse> => {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;
  const { data } = await apiClient.get<OmdbSearchResponse>('/', {
    params: { apikey: apiKey, s: query, type: 'movie', page },
  });

  if (data.Response === 'False') {
    return { page, results: [], total_pages: 0, total_results: 0 };
  }

  const total_results = parseInt(data.totalResults ?? '0', 10);
  const total_pages = Math.ceil(total_results / PAGE_SIZE);
  const baseMovies: Movie[] = (data.Search ?? []).map(mapSearchResult);

  // Fetch IMDb rating for each result (parallel, best-effort)
  const detailed = await Promise.allSettled(
    baseMovies.map((m) =>
      apiClient
        .get<OmdbMovieDetail>('/', {
          params: { apikey: apiKey, i: m.imdbID, plot: 'short' },
        })
        .then((r) => ({ ...m, ...mapDetail(r.data) } as Movie))
    )
  );

  const results = detailed.map((r, i) =>
    r.status === 'fulfilled' ? r.value : baseMovies[i]
  );

  return { page, results, total_pages, total_results };
};

export const getMoviePosterUrl = (
  posterPath: string | null,
  _size?: string
): string => {
  return posterPath ?? '';
};
