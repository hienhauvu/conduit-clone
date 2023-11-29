import React, { useState, useEffect } from "react";
import axios from "axios";

const FavoriteButton = ({ articleSlug }) => {
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [isToggling, setIsToggling] = useState(false);
  const [check, setCheck] = useState(false); // Add a state for re-render check

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const response = await axios.get(
          `https://api.realworld.io/api/articles/${articleSlug}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setIsFavoriting(response.data.article.favorited);
        setFavCount(response.data.article.favoritesCount);
        setCheck(!check); // Toggle the check variable to trigger re-render
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [articleSlug, userToken, check]); // Include check variable in dependencies

  const handleFavoriteToggle = async () => {
    try {
      setIsToggling(true);

      if (isFavoriting) {
        // If already favorited, perform unfavorite using DELETE
        await axios.delete(
          `https://api.realworld.io/api/articles/${articleSlug}/favorite`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      } else {
        // If not favorited, perform favorite using POST
        await axios.post(
          `https://api.realworld.io/api/articles/${articleSlug}/favorite`,
          null,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      }

      // Update favorite status and count after the toggle
      const response = await axios.get(
        `https://api.realworld.io/api/articles/${articleSlug}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setIsFavoriting(response.data.article.favorited);
      setFavCount(response.data.article.favoritesCount);
      setCheck(!check); // Toggle the check variable to trigger re-render
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${
        isFavoriting ? "btn-danger" : "btn-outline-danger"
      } article-button`}
      onClick={handleFavoriteToggle}
      disabled={isToggling}
      style={{
        cursor: isToggling ? "not-allowed" : "pointer",
        height: "31px",
        lineHeight: "21px",
        marginLeft: "5px",
      }}
    >
      <i
        className={`bi ${isFavoriting ? "bi-suit-heart-fill" : "bi-suit-heart"}`}
        style={{ marginRight: "0.2rem", fontSize: "1rem" }}
      ></i>
      {isFavoriting ? "Unfavorite" : "Favorite"} ({favCount})
    </button>
  );
};

export default FavoriteButton;
