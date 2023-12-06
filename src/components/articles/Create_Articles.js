import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../css/Create_Articles.css';

const Create_Articles = () => {
  const userToken = localStorage.getItem("userToken") || "";
  const navigate = useNavigate(); // Initialize navigate

  const [articleData, setArticleData] = useState({
    title: "",
    description: "",
    body: "",
    tags: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePublishArticle = async () => {
    try {
      const response = await axios.post(
        "https://api.realworld.io/api/articles",
        {
          article: {
            title: articleData.title,
            description: articleData.description,
            body: articleData.body,
            tagList: articleData.tags.split(",").map((tag) => tag.trim()),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // After publishing, navigate to the article detail page
      navigate(`/article/${response.data.article.slug}`);

      setArticleData({
        title: "",
        description: "",
        body: "",
        tags: "",
      });
    } catch (error) {
      console.error("Error publishing article:", error);
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    name="title"
                    value={articleData.title}
                    onChange={handleInputChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    name="description"
                    value={articleData.description}
                    onChange={handleInputChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    name="body"
                    value={articleData.body}
                    onChange={handleInputChange}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    name="tags"
                    value={articleData.tags}
                    onChange={handleInputChange}
                  />
                  <div className="tag-list"></div>
                </fieldset>
                <button
                  className="btn btn-lg btn-success btn-primary ml-auto"
                  type="button"
                  onClick={handlePublishArticle}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create_Articles;
