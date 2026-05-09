import { describe, it, expect } from 'vitest';
import { sortMovies, filterByRating, formatReleaseYear, formatRating } from '../utils/movieUtils';
import type { Movie } from '../types/movie';

const makeMovie = (overrides: Partial<Movie>): Movie => ({
  id: 'tt0000001',
  imdbID: 'tt0000001',
  title: 'Test Movie',
  overview: 'Overview',
  poster_path: null,
  release_date: '2020-01-01',
  vote_average: 7.0,
  vote_count: 100,
  popularity: 50,
  ...overrides,
});

const movies: Movie[] = [
  makeMovie({ id: 'tt0000001', title: 'Alpha', release_date: '2021-06-01', vote_average: 8.5, vote_count: 30 }),
  makeMovie({ id: 'tt0000002', title: 'Beta',  release_date: '2019-03-15', vote_average: 5.0, vote_count: 90 }),
  makeMovie({ id: 'tt0000003', title: 'Gamma', release_date: '2023-12-01', vote_average: 7.2, vote_count: 60 }),
];

describe('sortMovies', () => {
  it('sorts by release_date ascending', () => {
    const sorted = sortMovies(movies, 'release_date', 'asc');
    expect(sorted[0].release_date).toBe('2019-03-15');
    expect(sorted[2].release_date).toBe('2023-12-01');
  });

  it('sorts by release_date descending', () => {
    const sorted = sortMovies(movies, 'release_date', 'desc');
    expect(sorted[0].release_date).toBe('2023-12-01');
  });

  it('sorts by vote_average ascending', () => {
    const sorted = sortMovies(movies, 'vote_average', 'asc');
    expect(sorted[0].vote_average).toBe(5.0);
    expect(sorted[2].vote_average).toBe(8.5);
  });

  it('sorts by vote_average descending', () => {
    const sorted = sortMovies(movies, 'vote_average', 'desc');
    expect(sorted[0].vote_average).toBe(8.5);
  });

  it('sorts by title ascending (alphabetical)', () => {
    const sorted = sortMovies(movies, 'title', 'asc');
    expect(sorted[0].title).toBe('Alpha');
    expect(sorted[1].title).toBe('Beta');
    expect(sorted[2].title).toBe('Gamma');
  });

  it('sorts by title descending', () => {
    const sorted = sortMovies(movies, 'title', 'desc');
    expect(sorted[0].title).toBe('Gamma');
  });

  it('sorts by popularity (vote_count) descending', () => {
    const sorted = sortMovies(movies, 'popularity', 'desc');
    expect(sorted[0].vote_count).toBe(90);
  });

  it('does not mutate the original array', () => {
    const original = [...movies];
    sortMovies(movies, 'title', 'asc');
    expect(movies).toEqual(original);
  });
});

describe('filterByRating', () => {
  it('returns all movies when minRating is 0', () => {
    expect(filterByRating(movies, 0)).toHaveLength(3);
  });

  it('filters out movies below minRating', () => {
    const filtered = filterByRating(movies, 7.0);
    expect(filtered.every((m) => m.vote_average >= 7.0)).toBe(true);
    expect(filtered).toHaveLength(2);
  });

  it('returns empty array when no movies pass the filter', () => {
    expect(filterByRating(movies, 10)).toHaveLength(0);
  });

  it('includes movies exactly at the threshold', () => {
    const filtered = filterByRating(movies, 8.5);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Alpha');
  });
});

describe('formatReleaseYear', () => {
  it('returns the year from YYYY-MM-DD format', () => {
    expect(formatReleaseYear('2023-07-14')).toBe('2023');
  });

  it('returns N/A for empty string', () => {
    expect(formatReleaseYear('')).toBe('N/A');
  });

  it('handles OMDb date format "DD Mon YYYY"', () => {
    expect(formatReleaseYear('04 Nov 2016')).toBe('2016');
  });
});

describe('formatRating', () => {
  it('formats to one decimal place', () => {
    expect(formatRating(7.5)).toBe('7.5');
    expect(formatRating(8)).toBe('8.0');
    expect(formatRating(0)).toBe('0.0');
  });
});
