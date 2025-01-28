const {
  fetchTopics,
  fetchArticleByArticleId,
  fetchArticles,
} = require("./app.models");

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

module.exports = { getAllTopics, getArticlesByArticleId, getArticles };
