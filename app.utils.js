const db = require("./db/connection");
const { fetchTopics } = require("./app.models");

function checkUserExists(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "username not found",
        });
      } else {
        return "username exists";
      }
    });
}

function checkTopicExists(topicStr) {
  return fetchTopics().then((topicData) => {
    const topicDataArray = topicData.map((topic) => topic.slug);
    if (!topicDataArray.includes(topicStr)) {
      return Promise.reject({ status: 404, msg: "topic not found" });
    } else {
      return Promise.resolve("topic exists");
    }
  });
}

module.exports = { checkUserExists, checkTopicExists };
