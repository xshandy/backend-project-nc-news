const express = require("express");
const app = express();
const endpointsJson = require("./endpoints.json");
const {
  getAllTopics,
  getArticlesByArticleId,
  getArticles,
  getCommentsByArticleId,
  postComment,
  patchArticle,
  deleteCommentById,
  getUsers,
} = require("./app.controllers");

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticlesByArticleId);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.all("*", (request, response) => {
  response.status(404).send({ error: "Endpoint not found" });
});

app.use((error, request, response, next) => {
  if (
    error.code === "22P02" ||
    error.code === "23503" ||
    error.code === "42703"
  ) {
    response.status(400).send({ msg: "Bad Request" });
  } else next(error);
});

app.use((error, request, response, next) => {
  if (error.msg === "Bad Request") {
    response.status(400).send({ msg: "Bad Request" });
  } else next(error);
});

app.use((error, request, response, next) => {
  if (
    error.msg === "Not found" ||
    error.msg === "username not found" ||
    error.msg === "article not found"
  ) {
    response.status(404).send({ msg: "Not found" });
  } else next(error);
});

app.use((error, request, response, next) => {
  console.log(error, "<--------- need to action");
  response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
