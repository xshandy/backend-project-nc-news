const db = require("./db/connection");

const fetchTopics = () => {
  const SQLString = `SELECT * FROM topics`;

  return db.query(SQLString).then(({ rows }) => {
    return rows;
  });
};

const fetchArticleByArticleId = (id) => {
  const SQLString = `SELECT * FROM articles WHERE article_id=$1`;
  const args = [id];

  return db.query(SQLString, args).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: "Not found" });
    } else {
      return rows[0];
    }
  });
};

module.exports = { fetchTopics, fetchArticleByArticleId };
