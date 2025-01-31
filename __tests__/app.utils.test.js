const { checkUserExists, checkTopicExists } = require("../app.utils");
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
  test("should reject if the user does not exist", () => {
    return expect(checkUserExists(100)).rejects.toMatchObject({
      msg: "username not found",
      status: 404,
    });
  });
});

describe("check if Topics Exists", () => {
  test("should resolve if it exists ", () => {
    return expect(checkTopicExists("mitch")).resolves.toMatch("topic exists");
  });
  test("should reject if the topic does not exist", () => {
    return expect(checkTopicExists("elephant")).rejects.toMatchObject({
      msg: "topic not found",
      status: 404,
    });
  });
});
