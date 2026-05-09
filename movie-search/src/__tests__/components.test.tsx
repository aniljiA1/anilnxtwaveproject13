import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { StarRating } from '../components/StarRating';
import { EmptyState } from '../components/EmptyState';
import { ResultsInfo } from '../components/ResultsInfo';
import { MovieCard } from '../components/MovieCard';
import type { Movie } from '../types/movie';

const sampleMovie: Movie = {
  id: 'tt0468569',
  imdbID: 'tt0468569',
  title: 'The Dark Knight',
  overview: 'Batman faces the Joker.',
  poster_path: null,
  release_date: '2008-07-18',
  vote_average: 9.0,
  vote_count: 12000,
  popularity: 0,
};

// ─── SearchBar ────────────────────────────────────────────────────────────────
describe('SearchBar', () => {
  it('renders an input with the given value', () => {
    render(<SearchBar value="Inception" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('Inception')).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Matrix' } });
    expect(onChange).toHaveBeenCalledWith('Matrix');
  });

  it('shows a clear button when value is non-empty', () => {
    render(<SearchBar value="Batman" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('hides clear button when value is empty', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByLabelText('Clear search')).toBeNull();
  });

  it('calls onChange with empty string when clear is clicked', () => {
    const onChange = vi.fn();
    render(<SearchBar value="Batman" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('renders custom placeholder', () => {
    render(<SearchBar value="" onChange={vi.fn()} placeholder="Find films..." />);
    expect(screen.getByPlaceholderText('Find films...')).toBeInTheDocument();
  });
});

// ─── Pagination ───────────────────────────────────────────────────────────────
describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders page buttons for small page count', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 5')).toBeInTheDocument();
  });

  it('calls onPageChange when a page button is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('Page 3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables the previous button on page 1', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('navigates to previous page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('navigates to next page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});

// ─── StarRating ───────────────────────────────────────────────────────────────
describe('StarRating', () => {
  it('renders the rating score', () => {
    render(<StarRating rating={7.5} />);
    expect(screen.getByText('7.5')).toBeInTheDocument();
  });

  it('renders 0.0 for a zero rating', () => {
    render(<StarRating rating={0} />);
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  it('renders 10.0 for perfect rating', () => {
    render(<StarRating rating={10} />);
    expect(screen.getByText('10.0')).toBeInTheDocument();
  });
});

// ─── EmptyState ───────────────────────────────────────────────────────────────
describe('EmptyState', () => {
  it('renders idle state', () => {
    render(<EmptyState type="idle" />);
    expect(screen.getByText('Find Your Next Watch')).toBeInTheDocument();
  });

  it('renders no-results state with query', () => {
    render(<EmptyState type="no-results" query="XYZ123" />);
    expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    expect(screen.getByText(/XYZ123/)).toBeInTheDocument();
  });

  it('renders error state with message', () => {
    render(<EmptyState type="error" error="API key is invalid." />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('API key is invalid.')).toBeInTheDocument();
  });
});

// ─── ResultsInfo ──────────────────────────────────────────────────────────────
describe('ResultsInfo', () => {
  it('renders nothing when query is empty', () => {
    const { container } = render(
      <ResultsInfo totalResults={100} currentPage={1} totalPages={5} query="" shownCount={20} minRating={0} onClearRating={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when totalResults is 0', () => {
    const { container } = render(
      <ResultsInfo totalResults={0} currentPage={1} totalPages={0} query="test" shownCount={0} minRating={0} onClearRating={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows total results and query', () => {
    render(
      <ResultsInfo totalResults={500} currentPage={2} totalPages={25} query="Batman" shownCount={20} minRating={0} onClearRating={() => {}} />
    );
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('"Batman"')).toBeInTheDocument();
    expect(screen.getByText(/Page 2 of 25/)).toBeInTheDocument();
  });
});

// ─── MovieCard ────────────────────────────────────────────────────────────────
describe('MovieCard', () => {
  it('renders movie title', () => {
    render(<MovieCard movie={sampleMovie} />);
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
  });

  it('renders year from release_date', () => {
    render(<MovieCard movie={sampleMovie} />);
    expect(screen.getByText('2008')).toBeInTheDocument();
  });

  it('shows No Poster placeholder when poster_path is null', () => {
    render(<MovieCard movie={sampleMovie} />);
    expect(screen.getByText('No Poster')).toBeInTheDocument();
  });

  it('renders the rating', () => {
    render(<MovieCard movie={sampleMovie} />);
    expect(screen.getByText('9.0')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<MovieCard movie={sampleMovie} />);
    expect(screen.getByRole('article', { name: 'The Dark Knight' })).toBeInTheDocument();
  });
});
