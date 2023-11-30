// Articles_View.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FollowButton from "../buttons/FollowButton";
import FavoriteButton from "../buttons/FavoriteButton";
import Comment from "./Comment";
import axios from "axios";

const Articles_View = () => {
  const [user, setUser] = useState(null);
  const [article, setArticle] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const userToken = localStorage.getItem("userToken");
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleResponse = await axios.get(
          `https://api.realworld.io/api/articles/${slug}`
        );
        setArticle(articleResponse.data.article);

        const authorProfileResponse = await axios.get(
          `https://api.realworld.io/api/profiles/${articleResponse.data.article.author.username}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setUser(authorProfileResponse.data.profile);
        setIsFollowing(authorProfileResponse.data.profile.following);

        fetchComments(); // Move the comment fetching logic here

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug, userToken]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `https://api.realworld.io/api/articles/${slug}/comments`,
        { comment: { body: newComment } },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setComments([...comments, response.data.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleUpdateFollow = (updatedProfile) => {
    setUser(updatedProfile);
    setIsFollowing(updatedProfile.following);
  };

  const fetchComments = async () => {
    try {
      const commentsResponse = await axios.get(
        `https://api.realworld.io/api/articles/${slug}/comments`
      );
      setComments(commentsResponse.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  if (!article || !user) {
    return <div>Loading...</div>;
  }

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
              <FavoriteButton articleSlug={article.slug} />
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
          </div>
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <form onSubmit={handleCommentSubmit}>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    placeholder="Add your comment..."
                    value={newComment}
                    onChange={handleCommentChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Add Comment
                </button>
              </form>
              <div className="comments">
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    fetchComments={fetchComments}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles_View;
