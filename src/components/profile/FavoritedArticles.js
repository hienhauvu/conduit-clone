// FavoritedArticles.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Favorite from "../home/Favorite";
import Pagination from "../home/Pagination";

const FavoritedArticles = ({ username }) => {
  const [favoritedArticles, setFavoritedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Assuming you have a reasonable value for articlesPerPage
  const articlesPerPage = 10;

  const userToken = localStorage.getItem("userToken");

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchFavoritedArticles = async (offset) => {
    try {
      setLoading(true);
      const apiUrl = `https://api.realworld.io/api/articles?favorited=${username}&limit=${articlesPerPage}&offset=${offset}`;
      
      const headers = {};

      // If userToken is present, add the Authorization header
      if (userToken) {
        headers.Authorization = `Bearer ${userToken}`;
      }

      const response = await axios.get(apiUrl, { headers });
      setFavoritedArticles(response.data.articles);
      // Calculate total pages based on the total articles and articles per page
      setTotalPages(Math.ceil(response.data.articlesCount / articlesPerPage));
    } catch (error) {
      console.error("Error fetching favorited articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritedArticles(0); // Initial fetch with offset 0
  }, [username, userToken]);

  const handleUpdateFavorite = (updatedArticle) => {
    // Find the index of the updated article in the state
    const updatedIndex = favoritedArticles.findIndex(
      (article) => article.slug === updatedArticle.slug
    );

    if (updatedIndex !== -1) {
      // Update the state with the modified article
      setFavoritedArticles((prevArticles) => {
        const newArticles = [...prevArticles];
        newArticles[updatedIndex] = updatedArticle;
        return newArticles;
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    const newOffset = (pageNumber - 1) * articlesPerPage;
    setCurrentPage(pageNumber);
    fetchFavoritedArticles(newOffset);
  };

  return (
    <div>
      {loading ? (
        <div className="mt-3">Loading favorited articles...</div>
      ) : (
        <>
          {favoritedArticles.length > 0 ? (
            favoritedArticles.map((article) => (
              <div key={article.slug} className="article-preview">
                <div className="article-meta">
                  <a href={`/${article.author.username}`}>
                    <img
                      src={article.author.image}
                      alt={article.author.username}
                    />
                  </a>
                  <div className="info">
                    <a href={`/${article.author.username}`} className="author">
                      {article.author.username}
                    </a>
                    <span className="date">
                      {formatDate(article.createdAt)}
                    </span>
                  </div>
                  <Favorite
                    articleSlug={article.slug}
                    onUpdateFavorite={handleUpdateFavorite}
                    favCount={article.favoritesCount}
                  />
                </div>

                <a href={`/article/${article.slug}`} className="preview-link">
                  <h1>{article.title}</h1>
                  <p>{article.description}</p>
                  <div>
                    <span>Read more...</span>
                    <ul className="tag-list">
                      {article.tagList.map((tag) => (
                        <li
                          key={tag}
                          className="tag-default tag-pill tag-outline"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <div>No favorited articles found</div>
          )}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FavoritedArticles;
