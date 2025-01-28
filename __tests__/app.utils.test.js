const checkUserExists = require("../app.utils");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("check User Exists", () => {
  test("should resolve if it exists ", () => {
    return expect(checkUserExists("lurker")).resolves.toMatch(
      "username exists"
    );
  });
  test("should reject if the category does not exist", () => {
    return expect(checkUserExists(100)).rejects.toMatchObject({
      message: "username not found",
      status: 404,
    });
  });
});
