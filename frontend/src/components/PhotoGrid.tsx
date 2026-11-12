import { useState } from 'react';
import { EnrichedPhoto } from '../types/photo.types';
import { FALLBACK_IMAGE, imageFor } from '../utils/image';
import Lightbox from './Lightbox';

interface PhotoGridProps {
  photos: EnrichedPhoto[];
  loading: boolean;
  placeholderCount: number;
}

const SKELETON_RATIOS = [1, 4 / 5, 4 / 3, 3 / 4, 1, 2 / 3];

function PhotoTile({ photo, onOpen }: { photo: EnrichedPhoto; onOpen: () => void }) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const { src, ratio } = imageFor(photo, 400);

  return (
    <button
      type="button"
      className={`tile${loaded ? ' tile--loaded' : ''}`}
      style={{ aspectRatio: String(ratio) }}
      onClick={onOpen}
      aria-label={`Open photo: ${photo.title}`}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          if (!e.currentTarget.src.endsWith(FALLBACK_IMAGE)) e.currentTarget.src = FALLBACK_IMAGE;
          setLoaded(true);
        }}
      />
      <span className="tile__caption">
        <span className="tile__title">{photo.title}</span>
        <span className="tile__meta">{photo.album?.user?.name || 'Unknown author'}</span>
      </span>
    </button>
  );
}

export default function PhotoGrid({ photos, loading, placeholderCount }: PhotoGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Skeletons only when there is nothing to show yet; a refetch keeps the current
  // results on screen, dimmed, so typing in the search does not flash the page.
  if (loading && photos.length === 0) {
    return (
      <div className="masonry" aria-hidden="true">
        {Array.from({ length: placeholderCount }, (_, i) => (
          <div
            key={i}
            className="tile tile--skeleton"
            style={{ aspectRatio: String(SKELETON_RATIOS[i % SKELETON_RATIOS.length]) }}
          />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="empty">
        <p className="empty__title">No photos match your search</p>
        <p className="empty__hint">Try a shorter title, or clear the filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className={`masonry${loading ? ' masonry--stale' : ''}`} aria-busy={loading}>
        {photos.map((photo, index) => (
          <PhotoTile key={photo.id} photo={photo} onOpen={() => setOpenIndex(index)} />
        ))}
      </div>

      {openIndex !== null && photos[openIndex] && (
        <Lightbox
          photos={photos}
          index={openIndex}
          onNavigate={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
