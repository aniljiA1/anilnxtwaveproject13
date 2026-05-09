import styles from './StarRating.module.css';

interface StarRatingProps {
  rating: number;
  voteCount?: number;
}

export function StarRating({ rating, voteCount }: StarRatingProps) {
  const pct = (rating / 10) * 100;
  const label = rating.toFixed(1);
  return (
    <div className={styles.wrapper} title={`${label}/10${voteCount ? ` (${voteCount.toLocaleString()} votes)` : ''}`}>
      <div className={styles.stars}>
        <div className={styles.starsEmpty}>★★★★★</div>
        <div className={styles.starsFilled} style={{ width: `${pct}%` }}>★★★★★</div>
      </div>
      <span className={styles.score}>{label}</span>
    </div>
  );
}
