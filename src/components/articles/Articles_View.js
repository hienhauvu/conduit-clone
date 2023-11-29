import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import FollowButton from "../buttons/FollowButton";
import FavoriteButton from "../buttons/FavoriteButton";
import "../../css/Articles.css";

const Articles_View = () => {
  const { slug } = useParams();
  const [user, setUser] = useState(null);
  const [article, setArticle] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `https://api.realworld.io/api/articles/${slug}`
        );
        setArticle(response.data.article);

        // Fetch author's profile after getting the article
        fetchAuthorProfile(response.data.article.author.username);
        setIsFavorited(response.data.article.favorited);
        setFavCount(response.data.article.favoritesCount);

        console.log(response.data.article.favorited);
        console.log(response.data.article.favoritesCount);
        // Fetch article's favorite count and status

        document.title = response.data.article.title;
        //Fetch Favorited status
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    const fetchAuthorProfile = async (authorUsername) => {
      try {
        const response = await axios.get(
          `https://api.realworld.io/api/profiles/${authorUsername}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setUser(response.data.profile);
        setIsFollowing(response.data.profile.following);
        console.log("Is Followed: ", response.data.profile.following);
      } catch (error) {
        console.error("Error fetching author profile:", error);
      }
    };
    console.log("userToken:", userToken);

    fetchArticle();
  }, [slug, userToken]);

  const handleUpdateFollow = (updatedProfile) => {
    setUser(updatedProfile);
    setIsFollowing(updatedProfile.following);
  };

  if (!article || !user) {
    return <div>Loading...</div>;
  }

  // Format Date
  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <div className="article-meta_1">
            <a href={`/${article.author.username}`}>
              <img src={article.author.image} alt="" />
            </a>
            <div className="info">
              <a href={`/${article.author.username}`}>
                {article.author.username}
              </a>
              <span className="date">{formattedDate}</span>
            </div>
            <span>
              <FollowButton
                key={isFollowing ? "following" : "notFollowing"}
                profileUsername={user.username}
                onUpdateFollow={handleUpdateFollow}
                pageStyle="article-button"
              />
              {/* Favorite Button */}
              <FavoriteButton articleSlug={article.slug} />
            </span>
            {/* IF CURRENT USER IS AUTHOR */}
            <span style={{ display: "none" }}>
              <button>Edit</button>
              <button>Delete</button>
            </span>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row article-content">
          <div className="col-md-12">
            <div>
              <p>{article.body}</p>
            </div>
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <div className="article-meta_2">
            <a href={`/${article.author.username}`}>
              <img src={article.author.image} alt="" />
            </a>
            <div className="info">
              <a href={`/${article.author.username}`}>
                {article.author.username}
              </a>
              <span className="date">{formattedDate}</span>
            </div>
            <span>
              <FollowButton
                key={isFollowing ? "following" : "notFollowing"}
                profileUsername={user.username}
                onUpdateFollow={handleUpdateFollow}
                pageStyle="article-button"
              />
              <FavoriteButton articleSlug={article.slug} />
            </span>
            {/* IF CURRENT USER IS AUTHOR */}
            <span style={{ display: "none" }}>
              <button>Edit</button>
              <button>Delete</button>
            </span>
          </div>
          {/* Comment Section */}
          <div className="row">
            <div className="col-md-8 offset-md-2">Comment</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles_View;
