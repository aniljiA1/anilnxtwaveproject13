import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMovieSearch } from '../hooks/useMovieSearch';

vi.mock('../api/tmdb', () => ({ searchMovies: vi.fn() }));

import { searchMovies } from '../api/tmdb';

const mockMovies = [
  {
    id: 'tt0848228', imdbID: 'tt0848228', title: 'Avengers',
    overview: 'Heroes assemble.', poster_path: null,
    release_date: '2012-05-04', vote_average: 8.0, vote_count: 5000, popularity: 0,
  },
  {
    id: 'tt0468569', imdbID: 'tt0468569', title: 'Batman',
    overview: 'Dark knight rises.', poster_path: null,
    release_date: '2008-07-18', vote_average: 9.0, vote_count: 12000, popularity: 0,
  },
];

describe('useMovieSearch', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('starts with empty state and default filters', () => {
    const { result } = renderHook(() => useMovieSearch());
    expect(result.current.movies).toEqual([]);
    expect(result.current.filters.query).toBe('');
    expect(result.current.filters.page).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetches movies when query is set', async () => {
    vi.mocked(searchMovies).mockResolvedValue({
      page: 1, results: mockMovies, total_pages: 3, total_results: 25,
    });
    const { result } = renderHook(() => useMovieSearch());
    act(() => { result.current.updateFilters({ query: 'avengers' }); });
    await waitFor(() => expect(result.current.movies.length).toBe(2), { timeout: 1000 });
    expect(searchMovies).toHaveBeenCalledWith('avengers', 1);
    expect(result.current.totalResults).toBe(25);
    expect(result.current.totalPages).toBe(3);
  });

  it('resets to page 1 when query changes', () => {
    const { result } = renderHook(() => useMovieSearch());
    act(() => { result.current.updateFilters({ query: 'test', page: 3 }); });
    act(() => { result.current.updateFilters({ query: 'new query' }); });
    expect(result.current.filters.page).toBe(1);
  });

  it('sets error on API failure', async () => {
    vi.mocked(searchMovies).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useMovieSearch());
    act(() => { result.current.updateFilters({ query: 'fail' }); });
    await waitFor(() => expect(result.current.error).not.toBeNull(), { timeout: 1000 });
    expect(result.current.movies).toEqual([]);
  });

  it('filters movies by minRating client-side', async () => {
    vi.mocked(searchMovies).mockResolvedValue({
      page: 1, results: mockMovies, total_pages: 1, total_results: 2,
    });
    const { result } = renderHook(() => useMovieSearch());
    act(() => { result.current.updateFilters({ query: 'hero', minRating: 8.5 }); });
    await waitFor(() => expect(result.current.movies.length).toBe(1), { timeout: 1000 });
    expect(result.current.movies[0].title).toBe('Batman');
  });

  it('resets all filters', () => {
    const { result } = renderHook(() => useMovieSearch());
    act(() => { result.current.updateFilters({ query: 'test', page: 4, minRating: 7 }); });
    act(() => { result.current.resetFilters(); });
    expect(result.current.filters.query).toBe('');
    expect(result.current.filters.page).toBe(1);
    expect(result.current.filters.minRating).toBe(0);
  });

  it('clears movies when query is empty', async () => {
    vi.mocked(searchMovies).mockResolvedValue({
      page: 1, results: mockMovies, total_pages: 1, total_results: 2,
    });
    const { result } = renderHook(() => useMovieSearch());
    act(() => { result.current.updateFilters({ query: 'batman' }); });
    await waitFor(() => expect(result.current.movies.length).toBe(2), { timeout: 1000 });
    act(() => { result.current.updateFilters({ query: '' }); });
    await waitFor(() => expect(result.current.movies.length).toBe(0), { timeout: 1000 });
  });
});
