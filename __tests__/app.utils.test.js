const { checkUserExists, checkArticleExists } = require("../app.utils");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("check if User Exists", () => {
  test("should resolve if it exists ", () => {
    return expect(checkUserExists("lurker")).resolves.toMatch(
      "username exists"
    );
  });
  test("should reject if the category does not exist", () => {
    return expect(checkUserExists(100)).rejects.toMatchObject({
      msg: "username not found",
      status: 404,
    });
  });
});

describe("check if Article Exists", () => {
  test("should resolve if it exists", () => {
    return expect(checkArticleExists(1)).resolves.toMatch("article exists");
  });
  test("should reject if the article does not exist ", () => {
    return expect(checkArticleExists(1000)).rejects.toMatchObject({
      msg: "article not found",
      status: 404,
    });
  });
});
