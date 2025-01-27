const { fetchTopics } = require("./app.models");

const getAllTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

module.exports = { getAllTopics };
