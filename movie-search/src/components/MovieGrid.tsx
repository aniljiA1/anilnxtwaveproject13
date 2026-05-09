import { MovieCard } from './MovieCard';
import type { Movie } from '../types/movie';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  rawCount?: number;
  minRating?: number;
}

function SkeletonCard() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.skeletonPoster} />
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonLine} style={{ width: '75%' }} />
        <div className={styles.skeletonLine} style={{ width: '45%' }} />
      </div>
    </div>
  );
}

export function MovieGrid({ movies, isLoading, rawCount, minRating }: MovieGridProps) {
  if (isLoading) {
    return (
      <div className={styles.grid} aria-busy="true" aria-label="Loading movies">
        {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const isFiltered = (minRating ?? 0) > 0 && rawCount !== undefined && movies.length < rawCount;

  return (
    <div>
      {isFiltered && (
        <p className={styles.filterNote}>
          Showing {movies.length} of {rawCount} movies on this page with rating {minRating}+
        </p>
      )}
      <div className={styles.grid}>
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
}
