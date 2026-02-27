import {useState} from 'react';
import {Image, Card, Col, Form, Modal, Row} from 'react-bootstrap';
import {EnrichedPhoto} from '../types/photo.types';

interface PhotoDetailModalProps {
    photo: EnrichedPhoto | null;
    onClose: () => void;
}

function PhotoDetailModal({photo, onClose}: PhotoDetailModalProps) {
    if (!photo) return null;
    const user = photo.album?.user;

    return (
        <Modal show={!!photo} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className="fs-6 text-capitalize">{photo.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    <Col md={5} className="mb-3 mb-md-0">
                        <Image
                            src={photo.url}
                            alt={photo.title}
                            fluid
                            rounded
                            loading={"eager"}
                            style={{ width: '100%', objectFit: 'cover' }}
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                e.currentTarget.src = '/no-data.webp';
                                e.currentTarget.style.objectFit = 'contain';
                                e.currentTarget.style.padding = '50px';
                            }}
                        />
                    </Col>

                    <Col md={7}>
                        <h5 className="text-muted fw-semibold mb-1">
                            Album
                        </h5>
                        <p className="mb-1">{photo.album?.title || '—-'}</p>
                        <br/>

                        {user && (
                            <>
                                <h5 className="text-muted fw-semibold mb-2">
                                    User
                                </h5>
                                <p className="mb-1">
                                    {user.name} <span className="text-muted fw-normal">@{user.username}</span>
                                </p>
                                <p className="mb-1">{user.email}</p>
                                <p className="mb-1">{user.phone}</p>
                                <p className="mb-1 text-muted">
                                    {user.address?.street}, {user.address?.suite}, {user.address?.city} {user.address?.zipcode}
                                </p>
                                {user.company && (
                                    <p className="mb-0 text-muted small">{user.company.name}</p>
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}

interface PhotoGridProps {
    photos: EnrichedPhoto[];
    loading: boolean;
    total: number;
    limit: number;
    offset: number;
    onLimitChange: (limit: number) => void;
}

export default function PhotoGrid({photos, loading, total, limit, offset, onLimitChange}: PhotoGridProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<EnrichedPhoto | null>(null);

    const start = total === 0 ? 0 : offset + 1;
    const end = Math.min(offset + limit, total);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center my-3 flex-wrap gap-2">
                <span className="text-muted small">
                  {loading ? 'Loading...' : `Showing ${start}–${end} of ${total} photo${total !== 1 ? 's' : ''}`}
                </span>

                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted small">Per page:</span>
                    <Form.Select
                        size="sm"
                        style={{width: 'auto'}}
                        value={limit}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onLimitChange(Number(e.target.value))}
                    >
                        {[10, 25, 50, 100].map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </Form.Select>
                </div>
            </div>

            {!loading && photos.length === 0 && (
                <div className="text-center text-muted py-5">
                    <p className="fs-5">No photos match your filters.</p>
                </div>
            )}

            <Row xs={1} sm={2} md={3} lg={5} className="g-3">
                {
                    photos.map(photo => (
                        <Col key={photo.id}>
                            <Card
                                className="photo-card shadow-sm"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <Card.Img
                                    variant="top"
                                    src={photo.thumbnailUrl}
                                    alt={photo.title}
                                    loading="lazy"
                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                        e.currentTarget.src = '/no-data.webp';
                                    }}
                                />

                                <Card.Body className="p-2">
                                    <Card.Title className="card-title">{photo.title}</Card.Title>
                                    <Card.Text className="card-text text-muted">
                                        <strong>Album: </strong>
                                        {photo.album?.title || '—-'}
                                    </Card.Text>
                                    <Card.Text className="card-text text-muted">
                                        <strong>User: </strong>
                                        {photo.album?.user?.name || '—-'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
            </Row>

            <PhotoDetailModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)}/>
        </>
    );
}