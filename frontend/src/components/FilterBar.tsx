import { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Filters } from '../types/photo.types';

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [local, setLocal] = useState<Filters>(filters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocal({ ...local, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    onFilterChange(local);
  };

  const handleClear = () => {
    const empty: Filters = { title: '', albumTitle: '', albumUserEmail: '' };
    setLocal(empty);
    onFilterChange(empty);
  };

  const hasFilters = local.title || local.albumTitle || local.albumUserEmail;

  return (
      <Card className="shadow-sm mb-3">
        <Card.Body>
          <Card.Title className="fs-6 fw-semibold mb-3">Filters</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">

              <Col md={4}>
                <Form.Group>
                  <Form.Control
                      size="sm"
                      type="text"
                      name="title"
                      placeholder="Photo Title"
                      value={local.title}
                      onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Control
                      size="sm"
                      type="text"
                      name="albumTitle"
                      placeholder="Album Title"
                      value={local.albumTitle}
                      onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Control
                      size="sm"
                      type="text"
                      name="albumUserEmail"
                      placeholder="User Email"
                      value={local.albumUserEmail}
                      onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-3 d-flex gap-2">
              <Button variant="dark" size="sm" type="submit">
                Search
              </Button>
              {hasFilters && (
                  <Button variant="outline-secondary" size="sm" onClick={handleClear}>
                    Clear
                  </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
  );
}