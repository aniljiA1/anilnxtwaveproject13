import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MAX_VISIBLE = 5;

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= MAX_VISIBLE) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '...')[] = [];
  const half = Math.floor(MAX_VISIBLE / 2);
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);
  if (current - 1 <= half) end = Math.min(total - 1, MAX_VISIBLE - 1);
  if (total - current <= half) start = Math.max(2, total - MAX_VISIBLE + 2);
  pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');
  pages.push(total);
  return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const capped = Math.min(totalPages, 100);
  const pages = getPageNumbers(currentPage, capped);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        className={styles.btn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >‹</button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`e-${idx}`} className={styles.ellipsis}>…</span>
        ) : (
          <button
            key={page}
            className={`${styles.btn} ${page === currentPage ? styles.active : ''}`}
            onClick={() => onPageChange(page as number)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >{page}</button>
        )
      )}

      <button
        className={styles.btn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === capped}
        aria-label="Next page"
      >›</button>
    </nav>
  );
}
