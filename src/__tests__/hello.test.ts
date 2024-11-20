import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "..";

describe("GET /hello", () => {
  it("should return Hello, world!", async () => {
    const response = await request(app).get("/hello");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, world!");
  });
});
