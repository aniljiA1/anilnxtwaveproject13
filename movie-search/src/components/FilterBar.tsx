import type { SortOption, SortDirection } from '../types/movie';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  minRating: number;
  onSortByChange: (value: SortOption) => void;
  onSortDirectionChange: (value: SortDirection) => void;
  onMinRatingChange: (value: number) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'release_date', label: 'Release Date' },
  { value: 'vote_average', label: 'Rating' },
  { value: 'title', label: 'Title' },
];

export function FilterBar({
  sortBy, sortDirection, minRating,
  onSortByChange, onSortDirectionChange, onMinRatingChange,
}: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.group}>
        <label className={styles.label}>Sort by</label>
        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Order</label>
        <div className={styles.toggleGroup}>
          <button
            className={`${styles.toggleBtn} ${sortDirection === 'desc' ? styles.active : ''}`}
            onClick={() => onSortDirectionChange('desc')}
            aria-pressed={sortDirection === 'desc'}
          >↓ Desc</button>
          <button
            className={`${styles.toggleBtn} ${sortDirection === 'asc' ? styles.active : ''}`}
            onClick={() => onSortDirectionChange('asc')}
            aria-pressed={sortDirection === 'asc'}
          >↑ Asc</button>
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>
          Min Rating <span className={styles.ratingValue}>{minRating > 0 ? `${minRating}+` : 'Any'}</span>
        </label>
        <input
          type="range"
          min={0} max={9} step={1}
          value={minRating}
          onChange={(e) => onMinRatingChange(Number(e.target.value))}
          className={styles.slider}
          aria-label="Minimum rating filter"
        />
        <div className={styles.ratingTicks}>
          {[0,1,2,3,4,5,6,7,8,9].map((n) => (
            <span
              key={n}
              className={`${styles.tick} ${n === minRating ? styles.tickActive : ''}`}
              onClick={() => onMinRatingChange(n)}
            >{n === 0 ? 'All' : n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
