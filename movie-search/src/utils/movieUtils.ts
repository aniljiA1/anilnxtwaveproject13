import type { Movie, SortOption, SortDirection } from '../types/movie';

export const sortMovies = (
  movies: Movie[],
  sortBy: SortOption,
  direction: SortDirection
): Movie[] => {
  const sorted = [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'release_date': {
        const dateA = new Date(a.release_date || '1900-01-01').getTime();
        const dateB = new Date(b.release_date || '1900-01-01').getTime();
        return dateA - dateB;
      }
      case 'vote_average':
        return a.vote_average - b.vote_average;
      case 'popularity':
        return a.vote_count - b.vote_count; // OMDb: use vote_count as popularity proxy
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  return direction === 'desc' ? sorted.reverse() : sorted;
};

export const filterByRating = (movies: Movie[], minRating: number): Movie[] =>
  movies.filter((m) => m.vote_average >= minRating);

export const formatReleaseYear = (dateString: string): string => {
  if (!dateString) return 'N/A';
  // Handle "DD Mon YYYY" (OMDb) or "YYYY-01-01"
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString.slice(-4) || 'N/A';
  return d.getFullYear().toString();
};

export const formatRating = (rating: number): string => rating.toFixed(1);
