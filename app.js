const express = require("express");
const app = express();
const endpointsJson = require("./endpoints.json");
const {
  getAllTopics,
  getArticlesByArticleId,
  getArticles,
  getCommentsByArticleId,
} = require("./app.controllers");

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticlesByArticleId);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("*", (request, response) => {
  response.status(404).send({ error: "Endpoint not found" });
});

app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  } else next(error);
});

app.use((error, request, response, next) => {
  if (error.msg === "Not found") {
    response.status(404).send({ msg: "Not found" });
  } else next(error);
});

app.use((error, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
