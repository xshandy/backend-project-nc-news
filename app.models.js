const db = require("./db/connection");
const format = require("pg-format");

const fetchTopics = () => {
  const SQLString = `SELECT * FROM topics`;

  return db.query(SQLString).then(({ rows }) => {
    return rows;
  });
};

const fetchArticles = (queries) => {
  const { sort_by, order, topic } = queries;

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

  const topicGreenList = ["cats", "mitch", "paper"];

  if (topic && !topicGreenList.includes(topic)) {
    return Promise.reject({ msg: "Bad Request" });
  }

  if (topic) {
    SQLString = `SELECT * FROM articles WHERE topic = $1`;
  }

  return db.query(SQLString, topic ? [topic] : []).then(({ rows }) => {
    const noBodyProp = rows.map((article) => {
      const { body, ...noBodyProp } = article;
      return noBodyProp;
    });
    return noBodyProp;
  });
};

const fetchArticleByArticleId = (id) => {
  const SQLString = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  WHERE articles.article_id=$1
  GROUP BY articles.article_id`;

  const args = [id];

  return db.query(SQLString, args).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: "Not found" });
    } else {
      return rows[0];
    }
  });
};

const fetchCommentsByArticleId = (id) => {
  let SQLString = `SELECT * FROM comments WHERE comments.article_id = $1`;
  const args = [id];

  const defaultSortBy = "created_at";
  const defaultOrder = "desc";

  SQLString += ` ORDER BY ${defaultSortBy} ${defaultOrder}`;

  return db.query(SQLString, args).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: "Not found" });
    } else {
      return rows;
    }
  });
};

const addComment = (newComment, id) => {
  const { username, body } = newComment;
  let SQLString = `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`;
  const args = [body, username, id];
  return db.query(SQLString, args).then(({ rows }) => {
    return rows[0];
  });
};

const updateArticleVotes = (articleVotes, id) => {
  const votes = articleVotes.inc_votes;
  const SQLString = `UPDATE articles
  SET votes = votes + ${votes}
  WHERE article_id = ${id}
  RETURNING *`;
  return db.query(SQLString).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: "Not found" });
    }
    return rows[0];
  });
};

const removeCommentById = (comment_id) => {
  const SQLString = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;
  const args = [comment_id];

  return db.query(SQLString, args).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return result;
  });
};

const fetchUsers = () => {
  const SQLString = `SELECT * FROM users`;

  return db.query(SQLString).then(({ rows }) => {
    return rows;
  });
};

module.exports = {
  fetchTopics,
  fetchArticleByArticleId,
  fetchArticles,
  fetchCommentsByArticleId,
  addComment,
  updateArticleVotes,
  removeCommentById,
  fetchUsers,
};
