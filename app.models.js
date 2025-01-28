const db = require("./db/connection");
const articles = require("./db/data/test-data/articles");
//const { convertTimestampToDate } = require("./db/seeds/utils");

const fetchTopics = () => {
  const SQLString = `SELECT * FROM topics`;

  return db.query(SQLString).then(({ rows }) => {
    return rows;
  });
};

const fetchArticles = (queries) => {
  const { sort_by, order } = queries;

  const sortByGreenList = ["created_at"];
  const orderbyGreenList = ["desc", "asc"];

  const defaultSortBy = "created_at";
  const defaultOrder = "desc";

  let SQLString = `SELECT articles.*, COUNT(comments.article_id) AS comment_count 
  FROM articles 
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id`;

  const validSortBy = sortByGreenList.includes(sort_by)
    ? sort_by
    : defaultSortBy;
  const validOrderBy = orderbyGreenList.includes(order) ? order : defaultOrder;

  SQLString += ` ORDER BY ${validSortBy} ${validOrderBy}`;

  return db.query(SQLString).then(({ rows }) => {
    const noBodyProp = rows.map((article) => {
      const { body, ...noBodyProp } = article;
      return noBodyProp;
    });
    return noBodyProp;
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

module.exports = { fetchTopics, fetchArticleByArticleId, fetchArticles };
