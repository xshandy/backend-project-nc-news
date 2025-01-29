const db = require("./db/connection");

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

function checkArticleExists(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        });
      } else {
        return "article exists";
      }
    });
}

module.exports = { checkUserExists, checkArticleExists };
