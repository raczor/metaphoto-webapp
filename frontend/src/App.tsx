import { useState, useEffect, useCallback } from 'react';
import { Container, Navbar, Alert } from 'react-bootstrap';
import FilterBar from './components/FilterBar';
import PhotoGrid from './components/PhotoGrid';
import PaginationBar from './components/Pagination';
import { Filters, EnrichedPhoto, PhotosResponse } from './types/photo.types';

const baseUrl = process.env.REACT_APP_API_URL || '';

console.log('API BASE:', process.env.REACT_APP_API_URL);

export default function App() {
  const [photos, setPhotos] = useState<EnrichedPhoto[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    title: '',
    albumTitle: '',
    albumUserEmail: '',
  });

  const [limit, setLimit] = useState<number>(25);
  const [offset, setOffset] = useState<number>(0);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('limit', String(limit));
      params.set('offset', String(offset));

      if (filters.title) {
        params.set('title', filters.title);
      }

      if (filters.albumTitle) {
        params.set('album.title', filters.albumTitle);
      }

      if (filters.albumUserEmail) {
        params.set('album.user.email', filters.albumUserEmail);
      }

      const res = await fetch(`${baseUrl}/v1/api/photos?${params}`);
      if (!res.ok) {
        throw new Error(`API error: ${res.status} - ${res.statusText}`);
      }

      const json: PhotosResponse = await res.json();
      setPhotos(json.data);
      setTotal(json.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setPhotos([])
      setTotal(0)
    } finally {
      setLoading(false);
    }
  }, [filters, limit, offset]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setOffset(0);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setOffset(0);
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
      <>
        <Navbar bg="dark" variant="dark" className="mb-4 shadow-sm">
          <Container>
            <Navbar.Brand href="#">MetaPhoto</Navbar.Brand>
            <Navbar.Text className="text-secondary">
              Browse and filter your photo library
            </Navbar.Text>
          </Container>
        </Navbar>

        <Container className="pb-5">
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />

          {error &&
            <Alert variant="warning" className="mt-3">
              ⚠️ {error}
            </Alert>
          }

          <PhotoGrid
              photos={photos}
              loading={loading}
              total={total}
              limit={limit}
              offset={offset}
              onLimitChange={handleLimitChange}
          />

          {total > 0 && (
              <PaginationBar
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page: number) => setOffset((page - 1) * limit)}
              />
          )}
        </Container>
      </>
  );
}