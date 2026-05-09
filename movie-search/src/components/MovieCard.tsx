import { useState } from 'react';
import { getMoviePosterUrl } from '../api/tmdb';
import { formatReleaseYear } from '../utils/movieUtils';
import { StarRating } from './StarRating';
import type { Movie } from '../types/movie';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = getMoviePosterUrl(movie.poster_path);
  const year = formatReleaseYear(movie.release_date);

  return (
    <article className={styles.card} tabIndex={0} aria-label={movie.title}>
      <div className={styles.posterWrapper}>
        {!imgError && movie.poster_path ? (
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className={styles.poster}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.noPoster}>
            <span className={styles.noPosterIcon}>🎬</span>
            <span className={styles.noPosterText}>No Poster</span>
          </div>
        )}
        <div className={styles.overlay}>
          <p className={styles.overview}>{movie.overview || 'No description available.'}</p>
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <div className={styles.meta}>
          <span className={styles.year}>{year}</span>
          <StarRating rating={movie.vote_average} voteCount={movie.vote_count} />
        </div>
      </div>
    </article>
  );
}
