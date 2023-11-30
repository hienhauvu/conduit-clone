import React from 'react';
import '../../css/Pagination.css';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => (
  <ul className="pagination mt-1">
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
  </ul>
);

export default Pagination;
