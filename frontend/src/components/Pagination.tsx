import ReactPaginate from 'react-paginate';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationBar({ currentPage, totalPages, onPageChange }: PaginationBarProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pager" aria-label="Pages">
      <ReactPaginate
        pageCount={totalPages}
        forcePage={currentPage - 1}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        previousLabel="Previous"
        nextLabel="Next"
        breakLabel="…"
        containerClassName="pager__list"
        pageLinkClassName="pager__link"
        previousLinkClassName="pager__link pager__link--step"
        nextLinkClassName="pager__link pager__link--step"
        breakLinkClassName="pager__link pager__link--break"
        activeLinkClassName="pager__link--active"
        disabledLinkClassName="pager__link--disabled"
      />
    </nav>
  );
}
