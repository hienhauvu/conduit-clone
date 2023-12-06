// Comment.js
import React from "react";
import "../../css/Articles.css";
import axios from "axios";

const Comment = ({ comment, onReply, fetchComments }) => {
  const handleDeleteComment = async () => {
    try {
      await axios.delete(
        `https://api.realworld.io/api/articles/${comment.articleSlug}/comments/${comment.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      // After successful deletion, fetch comments again to update the UI
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div key={comment.id} className="comment-form card">
      <div class="card-block">
        <div class="form-control" rows="3">
          {comment.body}
        </div>
      </div>
      <div class="card-footer">
        {comment.author.image && (
          <a href={`/${comment.author.username}`}>
            <img
              src={comment.author.image}
              alt={`${comment.author.username}'s image`}
              className="comment-author-img"
            />
          </a>
        )}
        <a href={`/${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </a>
        <span className="date-posted">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
        {/* Clickable icon for delete */}
        <span class="mod-options" onClick={handleDeleteComment}>
          <i class="bi bi-trash3-fill"></i>
        </span>
      </div>
    </div>
  );
};

export default Comment;
