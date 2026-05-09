import { useMovieSearch } from './hooks/useMovieSearch';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { MovieGrid } from './components/MovieGrid';
import { Pagination } from './components/Pagination';
import { EmptyState } from './components/EmptyState';
import { ResultsInfo } from './components/ResultsInfo';
import type { SortOption, SortDirection } from './types/movie';
import styles from './App.module.css';

function App() {
  const {
    movies,
    rawCount,
    totalPages,
    totalResults,
    isLoading,
    error,
    filters,
    updateFilters,
  } = useMovieSearch();

  const showIdle = !filters.query && !isLoading;
  // No results = nothing from API (not just filtered out)
  const showNoResults = !!filters.query && !isLoading && !error && totalResults === 0;
  // Filtered empty = API returned results but all filtered out by minRating
  const showFilteredEmpty = !!filters.query && !isLoading && !error && totalResults > 0 && movies.length === 0;
  const showGrid = !showIdle && !showNoResults && !error && (movies.length > 0 || isLoading);

  const handlePageChange = (page: number) => {
    updateFilters({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>▶</span>
            <span className={styles.logoText}>CINEQUEST</span>
          </div>
          <p className={styles.tagline}>Discover millions of movies</p>
        </div>
        <div className={styles.searchSection}>
          <SearchBar
            value={filters.query}
            onChange={(q) => updateFilters({ query: q })}
          />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          {(filters.query || movies.length > 0) && (
            <FilterBar
              sortBy={filters.sortBy}
              sortDirection={filters.sortDirection}
              minRating={filters.minRating}
              onSortByChange={(v: SortOption) => updateFilters({ sortBy: v })}
              onSortDirectionChange={(v: SortDirection) => updateFilters({ sortDirection: v })}
              onMinRatingChange={(v: number) => updateFilters({ minRating: v })}
            />
          )}

          <ResultsInfo
            totalResults={totalResults}
            currentPage={filters.page}
            totalPages={totalPages}
            query={filters.query}
            shownCount={movies.length}
            minRating={filters.minRating}
            onClearRating={() => updateFilters({ minRating: 0 })}
          />

          {showIdle && <EmptyState type="idle" />}
          {error && <EmptyState type="error" error={error} />}
          {showNoResults && <EmptyState type="no-results" query={filters.query} />}

          {/* Show warning when rating filter hides everything on this page */}
          {showFilteredEmpty && (
            <EmptyState
              type="filtered-empty"
              query={filters.query}
              minRating={filters.minRating}
              onClearRating={() => updateFilters({ minRating: 0 })}
            />
          )}

          {(showGrid || isLoading) && (
            <MovieGrid movies={movies} isLoading={isLoading} rawCount={rawCount} minRating={filters.minRating} />
          )}

          {!isLoading && totalResults > 0 && (
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          Powered by{' '}
          <a href="https://www.omdbapi.com" target="_blank" rel="noopener noreferrer">
            OMDb API
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
