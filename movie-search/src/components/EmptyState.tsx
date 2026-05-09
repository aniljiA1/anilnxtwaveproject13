import styles from './EmptyState.module.css';

interface EmptyStateProps {
  type: 'idle' | 'no-results' | 'error' | 'filtered-empty';
  query?: string;
  error?: string | null;
  minRating?: number;
  onClearRating?: () => void;
}

export function EmptyState({ type, query, error, minRating, onClearRating }: EmptyStateProps) {
  if (type === 'idle') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.icon}>🎬</div>
        <h2 className={styles.title}>Find Your Next Watch</h2>
        <p className={styles.subtitle}>Search for any movie by name to get started</p>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.icon}>⚠️</div>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.subtitle}>{error}</p>
      </div>
    );
  }

  if (type === 'filtered-empty') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.icon}>⭐</div>
        <h2 className={styles.title}>No high-rated movies on this page</h2>
        <p className={styles.subtitle}>
          None of the results on this page have a rating of <strong>{minRating}+</strong>.
          Navigate to another page or{' '}
          <button className={styles.inlineBtn} onClick={onClearRating}>
            clear the rating filter
          </button>{' '}
          to see all results.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>🔍</div>
      <h2 className={styles.title}>No results found</h2>
      <p className={styles.subtitle}>
        We couldn't find any movies matching "{query}". Try a different search or adjust filters.
      </p>
    </div>
  );
}
