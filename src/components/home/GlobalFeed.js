import React, { useState, useEffect } from "react";
import axios from "axios";
import Favorite from "./Favorite";
import Pagination from "./Pagination";

const GlobalFeed = ({ selectedTag }) => {
  const [articles, setArticles] = useState([]);
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

  const fetchArticles = async (offset) => {
    try {
      setLoading(true);
      let apiUrl = `https://api.realworld.io/api/articles?limit=${articlesPerPage}&offset=${offset}`;

      // If a tag is selected, add tag filtering to the API endpoint
      if (selectedTag) {
        apiUrl += `&tag=${selectedTag}`;
      }

      const headers = {};

      // If userToken is present, add the Authorization header
      if (userToken) {
        headers.Authorization = `Bearer ${userToken}`;
      }

      const response = await axios.get(apiUrl, { headers });
      setArticles(response.data.articles);
      console.log("Total Global Articles: ", response.data.articlesCount);

      // Calculate total pages based on the total articles and articles per page
      setTotalPages(Math.ceil(response.data.articlesCount / articlesPerPage));
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(0); // Initial fetch with offset 0
  }, [selectedTag]);

  const handleUpdateFavorite = (updatedArticle) => {
    // Find the index of the updated article in the state
    const updatedIndex = articles.findIndex(
      (article) => article.slug === updatedArticle.slug
    );

    if (updatedIndex !== -1) {
      // Update the state with the modified article
      setArticles((prevArticles) => {
        const newArticles = [...prevArticles];
        newArticles[updatedIndex] = updatedArticle;
        return newArticles;
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    const newOffset = (pageNumber - 1) * articlesPerPage;
    setCurrentPage(pageNumber);
    fetchArticles(newOffset);
  };


  return (
    <div>
      {loading ? (
        <div className="mt-3">Loading articles...</div>
      ) : (
        <>
          {articles.length > 0 ? (
            articles.map((article) => (
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
            <div>No articles found</div>
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

export default GlobalFeed;
