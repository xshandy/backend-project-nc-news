# Northcoders News API

To ensure access to the necessary environment variables, you will need to add two files .env.development and .env.test. Insides those files you will need to add "PGDATABASE= NAME_OF_DATABASE" to connect to the database locally.
Look at .env-example for guidance

GET/api

Purpose and Functionality - This endpoint returns a JSON list of all available API routes and their descriptions.

Acceptable queries - It does not accept any query

Format of request body - No request, as its simply retrieve the API docs

Example response - The response is a JSON object about each available endpoints

{"endpoints": {
"GET /api": {
"description": "serves up a json representation of all the available endpoints of the api"
},}}

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
