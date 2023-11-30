import React, { useState, useEffect } from "react";
import axios from "axios";
import Favorite from "./Favorite";
import Pagination from "./Pagination";


const YourFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const articlesPerPage = 10; // Define articlesPerPage as a constant

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchArticles = async (offset) => {
    try {
      setLoading(true);
      const userToken = localStorage.getItem("userToken");
      const response = await axios.get(
        `https://api.realworld.io/api/articles/feed?limit=${articlesPerPage}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setArticles(response.data.articles);
      console.log("Total Your Feed Articles: ", response.data.articlesCount);

      setTotalPages(Math.ceil(response.data.articlesCount / articlesPerPage));
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const offset = (currentPage - 1) * articlesPerPage;
    fetchArticles(offset);
  }, [currentPage]);

  const handleUpdateFavorite = (updatedArticle) => {
    const updatedIndex = articles.findIndex(
      (article) => article.slug === updatedArticle.slug
    );

    if (updatedIndex !== -1) {
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

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
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
              goToPreviousPage={goToPreviousPage}
              goToNextPage={goToNextPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default YourFeed;
