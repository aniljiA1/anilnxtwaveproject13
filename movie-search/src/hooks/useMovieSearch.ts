import { useState, useCallback, useEffect, useRef } from 'react';
import { searchMovies } from '../api/tmdb';
import { sortMovies, filterByRating } from '../utils/movieUtils';
import type { Movie, SearchFilters } from '../types/movie';

interface UseMovieSearchReturn {
  movies: Movie[];          // filtered + sorted results for display
  rawCount: number;         // count before rating filter (for info display)
  totalPages: number;
  totalResults: number;
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
  updateFilters: (updates: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  page: 1,
  sortBy: 'popularity',
  sortDirection: 'desc',
  minRating: 0,
};

// These keys reset page to 1 when changed
const RESET_PAGE_KEYS: (keyof SearchFilters)[] = [
  'query',
  'minRating',
  'sortBy',
  'sortDirection',
];

export const useMovieSearch = (): UseMovieSearchReturn => {
  const [rawMovies, setRawMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const requestIdRef = useRef(0);

  const fetchMovies = useCallback(async (currentFilters: SearchFilters) => {
    if (!currentFilters.query.trim()) {
      setRawMovies([]);
      setTotalPages(0);
      setTotalResults(0);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchMovies(currentFilters.query, currentFilters.page);
      if (requestId !== requestIdRef.current) return;
      setRawMovies(response.results);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch {
      if (requestId !== requestIdRef.current) return;
      setError('Failed to fetch movies. Please check your API key and try again.');
      setRawMovies([]);
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchMovies(filters), 400);
    return () => clearTimeout(timer);
  }, [filters, fetchMovies]);

  const sorted = sortMovies(rawMovies, filters.sortBy, filters.sortDirection);
  const movies = filterByRating(sorted, filters.minRating);
  const rawCount = sorted.length; // before rating filter

  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      // Reset page when anything except page itself changes
      if (RESET_PAGE_KEYS.some((key) => key in updates)) next.page = 1;
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  return {
    movies,
    rawCount,
    totalPages,
    totalResults,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
  };
};
