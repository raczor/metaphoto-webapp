import { useState, useEffect } from 'react';
import FilterBar from './components/FilterBar';
import PhotoGrid from './components/PhotoGrid';
import PaginationBar from './components/Pagination';
import { Filters, EnrichedPhoto, PhotosResponse } from './types/photo.types';

const baseUrl = process.env.REACT_APP_API_URL || '';
const SEARCH_DEBOUNCE_MS = 300;
const PAGE_SIZES = [12, 24, 48, 96];

export default function App() {
  const [photos, setPhotos] = useState<EnrichedPhoto[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    title: '',
    albumTitle: '',
    albumUserEmail: '',
  });

  const [limit, setLimit] = useState<number>(24);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    // Typing fires this effect on every keystroke; the timer debounces the
    // request and the abort drops any response that arrives out of order.
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        params.set('offset', String(offset));
        if (filters.title) params.set('title', filters.title);
        if (filters.albumTitle) params.set('album.title', filters.albumTitle);
        if (filters.albumUserEmail) params.set('album.user.email', filters.albumUserEmail);

        const res = await fetch(`${baseUrl}/v1/api/photos?${params}`, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`API error: ${res.status} - ${res.statusText}`);
        }

        const json: PhotosResponse = await res.json();
        setPhotos(json.data);
        setTotal(json.total);
        setLoading(false);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
        setPhotos([]);
        setTotal(0);
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, limit, offset]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setOffset(0);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setOffset(0);
  };

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const start = total === 0 ? 0 : offset + 1;
  const end = Math.min(offset + limit, total);

  return (
    <>
      <header className="topbar">
        <div className="topbar__inner">
          <a className="brand" href="/" aria-label="MetaPhoto home">
            <span className="brand__mark" aria-hidden="true" />
            MetaPhoto
          </a>
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </header>

      <main className="page">
        <div className="toolbar">
          <p className="toolbar__count" aria-live="polite">
            {loading && photos.length === 0
              ? 'Loading photos'
              : total === 0
                ? 'No photos'
                : `${start.toLocaleString()} to ${end.toLocaleString()} of ${total.toLocaleString()} ${total === 1 ? 'photo' : 'photos'}`}
          </p>
          <label className="toolbar__size">
            Per page
            <select value={limit} onChange={(e) => handleLimitChange(Number(e.target.value))}>
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <div className="notice" role="alert">
            Could not load photos. {error}
          </div>
        )}

        <PhotoGrid photos={photos} loading={loading} placeholderCount={Math.min(limit, 24)} />

        {total > 0 && (
          <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </main>
    </>
  );
}
