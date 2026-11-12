import { useEffect, useRef } from 'react';
import { EnrichedPhoto } from '../types/photo.types';
import { FALLBACK_IMAGE, imageFor } from '../utils/image';

interface LightboxProps {
  photos: EnrichedPhoto[];
  index: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

export default function Lightbox({ photos, index, onNavigate, onClose }: LightboxProps) {
  const photo = photos[index];
  const user = photo.album?.user;
  const { src, ratio } = imageFor(photo, window.innerWidth <= 860 ? 800 : 1200);
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock page scroll and hand focus back to the tile that opened the dialog.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onNavigate(index - 1);
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNavigate(index + 1);
      } else if (e.key === 'Tab') {
        // Keep Tab inside the dialog.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        // Focus is lost when the focused arrow becomes disabled at either end.
        if (!dialogRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, hasPrev, hasNext, onNavigate, onClose]);

  // The bar, body and stage cover the whole overlay, so each one closes on a direct click.
  const closeOnBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      ref={dialogRef}
      onClick={closeOnBackdrop}
    >
      <div className="lightbox__bar">
        <span className="lightbox__counter">
          {index + 1} / {photos.length}
        </span>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close" ref={closeRef}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="lightbox__body" onClick={closeOnBackdrop}>
        <div className="lightbox__stage" onClick={closeOnBackdrop}>
          <button
            type="button"
            className="icon-btn lightbox__nav lightbox__nav--prev"
            onClick={() => onNavigate(index - 1)}
            disabled={!hasPrev}
            aria-label="Previous photo"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M12 4 6 10l6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <img
            key={photo.id}
            className="lightbox__image"
            src={src}
            alt={photo.title}
            style={{ aspectRatio: String(ratio) }}
            onError={(e) => {
              if (!e.currentTarget.src.endsWith(FALLBACK_IMAGE)) e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />

          <button
            type="button"
            className="icon-btn lightbox__nav lightbox__nav--next"
            onClick={() => onNavigate(index + 1)}
            disabled={!hasNext}
            aria-label="Next photo"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m8 4 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <aside className="lightbox__panel">
          <h2 className="lightbox__title">{photo.title}</h2>

          <dl className="facts">
            <div>
              <dt>Album</dt>
              <dd>{photo.album?.title || 'No album'}</dd>
            </div>
            {user && (
              <>
                <div>
                  <dt>Author</dt>
                  <dd>
                    {user.name} <span className="facts__muted">@{user.username}</span>
                  </dd>
                </div>
                <div>
                  <dt>Contact</dt>
                  <dd>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                    <br />
                    {user.phone}
                  </dd>
                </div>
                {user.address && (
                  <div>
                    <dt>Location</dt>
                    <dd>
                      {user.address.street}, {user.address.suite}
                      <br />
                      {user.address.city} {user.address.zipcode}
                    </dd>
                  </div>
                )}
                {user.company && (
                  <div>
                    <dt>Company</dt>
                    <dd>{user.company.name}</dd>
                  </div>
                )}
              </>
            )}
          </dl>

          <p className="lightbox__hint">Use the arrow keys to move between photos, Esc to close.</p>
        </aside>
      </div>
    </div>
  );
}
