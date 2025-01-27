const { fetchTopics, fetchArticleByArticleId } = require("./app.models");
const articles = require("./db/data/test-data/articles");

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

module.exports = { getAllTopics, getArticlesByArticleId };
