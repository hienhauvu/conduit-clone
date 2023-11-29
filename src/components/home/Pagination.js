import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  goToPreviousPage,
  goToNextPage,
}) => (
  <ul className="pagination mt-4">
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button className="page-link" onClick={goToPreviousPage}>
        {"<"}
      </button>
    </li>
    {Array.from({ length: totalPages }, (_, index) => (
      <li
        key={index + 1}
        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </button>
      </li>
    ))}
    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
      <button className="page-link" onClick={goToNextPage}>
        {">"}
      </button>
    </li>
  </ul>
);

export default Pagination;
