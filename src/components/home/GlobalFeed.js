import React, { useState, useEffect } from "react";
import axios from "axios";
import Favorite from "./Favorite";

const GlobalFeed = ({ selectedTag }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        let apiUrl = "https://api.realworld.io/api/articles";
        
        // If a tag is selected, add tag filtering to the API endpoint
        if (selectedTag) {
          apiUrl += `?tag=${selectedTag}`;
        }

        const response = await axios.get(apiUrl);
        setArticles(response.data.articles);
        console.log("Fetched Articles:", response.data.articles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
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
  


  return (
    <div>
      {loading ? (
        <div>Loading articles...</div>
      ) : (
        globalArticles.map((article) => (
          <div key={article.slug} className="article-preview">
            <div className="article-meta">
              <a href={`/${article.author.username}`}>
                <img src={article.author.image} alt={article.author.username} />
              </a>
              <div className="info">
                <a href={`/${article.author.username}`} className="author">
                  {article.author.username}
                </a>
                <span className="date">{formatDate(article.createdAt)}</span>
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
                    <li key={tag} className="tag-default tag-pill tag-outline">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default GlobalFeed;
