import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
 
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      onPageChange={onPageChange}
      forcePage={currentPage - 1} 
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel="<"
      nextLabel=">"
      disabledClassName={css.disabled}
    />
  );
}
