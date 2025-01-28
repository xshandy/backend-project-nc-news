const {
  fetchTopics,
  fetchArticleByArticleId,
  fetchArticles,
  fetchCommentsByArticleId,
  addComment,
} = require("./app.models");
const checkUserExists = require("./app.utils");

const getAllTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

const getArticlesByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleByArticleId(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

const getArticles = (request, response, next) => {
  const query = request.query;
  fetchArticles(query)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

const postComment = (request, response, next) => {
  const { username, body } = request.body;
  const { article_id } = request.params;

  checkUserExists(username)
    .then(() => {
      return addComment({ username, body }, article_id);
    })
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getAllTopics,
  getArticlesByArticleId,
  getArticles,
  getCommentsByArticleId,
  postComment,
};
