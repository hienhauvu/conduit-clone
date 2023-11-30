import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Favorite = ({ articleSlug, onUpdateFavorite, favCount }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const userToken = localStorage.getItem("userToken");

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        // Check if userToken is present before making the request
        if (userToken) {
          const response = await axios.get(
            `https://api.realworld.io/api/articles/${articleSlug}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          setIsFavorited(response.data.article.favorited);
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [articleSlug, userToken]);

  const handleFavoriteToggle = async () => {
    try {
      setIsToggling(true);

      // Check if user is logged in
      if (!userToken) {
        // Redirect to the login page if user is not logged in
        navigate("/login");
        return;
      }

      if (isFavorited) {
        await axios.delete(
          `https://api.realworld.io/api/articles/${articleSlug}/favorite`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      } else {
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

      // Update favorite status after the toggle
      const response = await axios.get(
        `https://api.realworld.io/api/articles/${articleSlug}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setIsFavorited(response.data.article.favorited);
      onUpdateFavorite(response.data.article);

      // Log whether it's favorited or not after the toggle
      console.log(
        `Article ${
          response.data.article.favorited ? "favorited" : "unfavorited"
        }`
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${
        isFavorited ? "btn-danger" : "btn-outline-danger"
      }`}
      onClick={handleFavoriteToggle}
      disabled={isToggling}
      style={{
        cursor: isToggling ? "not-allowed" : "pointer",
        height: "31px",
        lineHeight: "21px",
      }}
    >
      <i
        className={`bi ${isFavorited ? "bi-suit-heart-fill" : "bi-suit-heart"}`}
        style={{ marginRight: "0.2rem", fontSize: "1rem" }}
      ></i>
      {favCount}
    </button>
  );
};

export default Favorite;
