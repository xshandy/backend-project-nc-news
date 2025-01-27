const express = require("express");
const app = express();
const endpointsJson = require("./endpoints.json");
const { getAllTopics } = require("./app.controllers");

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getAllTopics);

app.all("*", (request, response) => {
  response.status(404).send({ error: "Endpoint not found" });
});

module.exports = app;
