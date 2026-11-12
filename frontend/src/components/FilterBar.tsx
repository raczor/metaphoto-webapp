import { useState } from 'react';
import { Filters } from '../types/photo.types';

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const EMPTY: Filters = { title: '', albumTitle: '', albumUserEmail: '' };

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const extraCount = (filters.albumTitle ? 1 : 0) + (filters.albumUserEmail ? 1 : 0);
  const [showMore, setShowMore] = useState<boolean>(false);
  const hasFilters = Boolean(filters.title || extraCount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="search__row">
        <div className="search__field search__field--main">
          <svg className="search__icon" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M13.5 13.5 18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            name="title"
            placeholder="Search photos by title"
            aria-label="Search photos by title"
            autoComplete="off"
            value={filters.title}
            onChange={handleChange}
          />
        </div>

        <button
          type="button"
          className="chip"
          aria-expanded={showMore}
          aria-controls="more-filters"
          onClick={() => setShowMore((v) => !v)}
        >
          Filters{extraCount > 0 && <span className="chip__badge">{extraCount}</span>}
        </button>

        {hasFilters && (
          <button type="button" className="chip chip--ghost" onClick={() => onFilterChange(EMPTY)}>
            Clear
          </button>
        )}
      </div>

      {showMore && (
        <div className="search__more" id="more-filters">
          <div className="search__field">
            <input
              type="text"
              name="albumTitle"
              placeholder="Album title"
              aria-label="Album title"
              autoComplete="off"
              value={filters.albumTitle}
              onChange={handleChange}
            />
          </div>
          <div className="search__field">
            <input
              type="text"
              name="albumUserEmail"
              placeholder="Owner email"
              aria-label="Owner email"
              autoComplete="off"
              value={filters.albumUserEmail}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </form>
  );
}
