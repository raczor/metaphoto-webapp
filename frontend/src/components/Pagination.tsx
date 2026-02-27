import ReactPaginate from 'react-paginate';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationBar({ currentPage, totalPages, onPageChange }: PaginationBarProps) {
  if (totalPages <= 1) return null;

  return (
      <div className="d-flex justify-content-center mt-4">
        <ReactPaginate
            pageCount={totalPages}
            forcePage={currentPage - 1}
            onPageChange={({ selected }) => onPageChange(selected + 1)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={4}
            previousLabel="‹ Prev"
            nextLabel="Next ›"
            breakLabel="..."
            containerClassName="pagination pagination-sm mb-0"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
            disabledClassName="disabled"
        />
      </div>
  );
}