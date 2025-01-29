const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("should respond with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.topics.length).toBe(3);

        body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("General error handler - All bad URL", () => {
  test('should respond with 404 and a message of "Endpoint not found" ', () => {
    return request(app)
      .get("/api/NA")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Endpoint not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should respond with the correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("should send an 400 status and error message when given an invalid id ", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((response) => {
        const body = response.body.msg;

        expect(body).toBe("Bad Request");
      });
  });
  test("should sends an 404 status and error message when given a valid but non-existent id ", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((response) => {
        const body = response.body.msg;

        expect(body).toBe("Not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("should respond with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const body = response.body;

        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles?&sort_by=created_at&order=desc")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test('should use default sort_by "created_at" and order if an invalid field is provided or missing', () => {
    return request(app)
      .get("/api/articles?sort_by=abc")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("should respond with an array of comments for an article ", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.comments.length).toBe(2);
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("should send a 404 and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((response) => {
        const body = response.body;
        expect(body.msg).toBe("Not found");
      });
  });
  test("should respond with an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/abc/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("should respond with the posted comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "lurker",
        body: "How's everyone doing?",
      })
      .expect(201)
      .then((response) => {
        const body = response.body;
        expect(body.postedComment.body).toBe("How's everyone doing?");
      });
  });
  test("should send a 400 when given an invalid id is a number ", () => {
    return request(app)
      .post("/api/articles/1000/comments")
      .send({
        username: "lurker",
        body: "How's everyone doing?",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("should send a 400 when given an invalid id is a string ", () => {
    return request(app)
      .post("/api/articles/abc/comments")
      .send({
        username: "lurker",
        body: "How's everyone doing?",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("should respond with an appropriate error message when user is invalid ", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "intruder",
        body: "Boo",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("should send a 400 when missing input - username", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        body: "Boo",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("should send a 400 when missing input - body", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: "intruder",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("should update, increment votes on an, article by article_id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.article.votes).toBe(110);
      });
  });
  test("should update, decrement votes on an, article by article_id  ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -50 })
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.article.votes).toBe(50);
      });
  });
  test("should send a 400 when given an invalid vote ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "abc" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("should delete the specified comment and send no content back  ", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("should send a 400 when given an invalid id  ", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("should send a 404 when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/users", () => {
  test("should respond with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body.users.length).toBe(4);

        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
