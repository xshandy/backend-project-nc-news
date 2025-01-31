const {
  fetchTopics,
  fetchArticleByArticleId,
  fetchArticles,
  fetchCommentsByArticleId,
  addComment,
  updateArticleVotes,
  removeCommentById,
  fetchUsers,
} = require("./app.models");
const { checkUserExists, checkTopicExists } = require("./app.utils");

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
  const { topic } = query;

  if (topic) {
    checkTopicExists(topic)
      .then(() => {
        return fetchArticles(query);
      })
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch((error) => {
        if (error.status === 404) {
          response.status(200).send({ articles: [] });
        } else {
          next(error);
        }
      });
  } else {
    fetchArticles(query)
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch(next);
  }
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
  if (!username || !body) {
    return next({ msg: "Bad Request" });
  }

  checkUserExists(username)
    .then(() => {
      return addComment({ username, body }, article_id);
    })
    .then((postedComment) => {
      response.status(201).send({ postedComment });
    })
    .catch((error) => {
      next(error);
    });
};

const patchArticle = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  if (/[^0-9]/.test(article_id)) {
    return next({ msg: "Bad Request" });
  }

  updateArticleVotes({ inc_votes }, article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

const deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};

const getUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
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
  patchArticle,
  deleteCommentById,
  getUsers,
};
