# Northcoders News API

This API is built to interact with a PostgreSQL database, handling application data much like the backend of a platform such as Reddit. Built with Node.js, it uses the node-postgres package to interact with the database, providing endpoints for managing articles, comments, and topics.

--Hosted Version--

(https://backend-project-nc-news-owjq.onrender.com)

By default, this link points to the root (/) path, where the server will respond with a 404 error. To verify that the API is working properly, try making a request to an existing endpoint like /api to ensure data is being fetched correctly.

--Summary--

This project provides a fully functional RESTful API for interacting with application data, including articles, comments, users, and topics. With this API, you can:

-View articles and comments.
-Add, update, or delete articles and comments.
-Retrieve topics and sort articles by various parameters.
-Access user details.

--Instruction--

-Clone the respository

https://github.com/xshandy/backend-project-nc-news

-Install Dependencies

Ensure Node.js and PostgreSQL are installed. Also install the following packages dotenv, express, pg, husky, jest, jest-extended, jest-sorted etc (look at package-lock file for more).

-Set-up Database

You will need to "run setup-dbs" to create database
After "run seed" to populate the data.

-Run test

To run the tests, enter "npm test"

--Information about how to create the two .env.files--

To ensure access to the necessary environment variables, you will need to add two files .env.development and .env.test. Inside .env.development you will need to add "PGDATABASE=nc_news" and inside .env.test you will need to add "PGDATABASE=nc_news_test", to connect to the database locally.

--Minimum versions--

Node.js - 17 or higher
PostgreSQL - 16 or higher

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
