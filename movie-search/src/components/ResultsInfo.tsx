import styles from './ResultsInfo.module.css';

interface ResultsInfoProps {
  totalResults: number;
  currentPage: number;
  totalPages: number;
  query: string;
  shownCount: number;
  minRating: number;
  onClearRating: () => void;
}

export function ResultsInfo({
  totalResults, currentPage, totalPages,
  query, shownCount, minRating, onClearRating,
}: ResultsInfoProps) {
  if (!query || totalResults === 0) return null;

  const isFiltered = minRating > 0;
  const isEmptyDueToFilter = isFiltered && shownCount === 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <span>
          <strong>{totalResults.toLocaleString()}</strong> results for{' '}
          <em>"{query}"</em>
        </span>
        <span className={styles.page}>
          Page {currentPage} of {Math.min(totalPages, 100)}
        </span>
      </div>

      {isFiltered && (
        <div className={`${styles.filterWarning} ${isEmptyDueToFilter ? styles.filterWarningEmpty : ''}`}>
          {isEmptyDueToFilter ? (
            <>
              ⚠️ No movies on this page have a rating of <strong>{minRating}+</strong>.
              Try{' '}
              <button className={styles.clearBtn} onClick={onClearRating}>
                clearing the rating filter
              </button>
              {' '}or navigate to another page.
            </>
          ) : (
            <>
              ⭐ Showing <strong>{shownCount}</strong> of 10 movies on this page with rating <strong>{minRating}+</strong>
              {' '}—{' '}
              <button className={styles.clearBtn} onClick={onClearRating}>
                clear filter
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
