import dotenv from "dotenv";
import { app } from "../../index";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";

describe("Weather Service integration tests", () => {
  let request: TestAgent;
  beforeEach(() => {
    dotenv.config();
    request = supertest(app);
  });

  describe("Status Code tests", () => {
    it("should return a 200 status code", async () => {
      const response = await request.get("/weather?lat=40&lon=40");
      expect(response.status).toBe(200);
    });

    it("should return a 400 status code for invalid coordinates", async () => {
      const response = await request.get("/weather?lat=100&lon=200");
      expect(response.status).toBe(400);
    });

    it("should return a 400 status code for missing coordinates", async () => {
      const response = await request.get("/weather");
      expect(response.status).toBe(400);
    });

    it("should return a 404 status code for invalid route", async () => {
      const response = await request.get("/invalid-route");
      expect(response.status).toBe(404);
    });
  });

  describe("Functional tests", () => {
    it("should have feeling in the response body", async () => {
      const response = await request.get("/weather?lat=40&lon=40");
      expect(response.body.feeling).toBeDefined();
    });

    it("feeling should be 'hot', 'cold', or 'moderate'", async () => {
      const response = await request.get("/weather?lat=40&lon=40");
      expect(response.body.feeling).toMatch(/hot|cold|moderate/);
    });

    it("should have at least 1 condition in the response body", async () => {
      const response = await request.get("/weather?lat=40&lon=40");
      expect(response.body.conditions).toBeInstanceOf(Array);
      expect(response.body.conditions.length).toBeGreaterThan(0);
    });

    it("should have an array of alerts in the response body", async () => {
      const response = await request.get("/weather?lat=40&lon=40");
      expect(response.body.alerts).toBeInstanceOf(Array);
    });
  });

  describe("Error tests for additional edge cases", () => {
    it("should return an error if lat is an empty string", async () => {
      const response = await request.get("/weather?lat=&lon=40");
      expect(response.status).toBe(400);
    });

    it("should return an error if lon is an empty string", async () => {
      const response = await request.get("/weather?lat40=&lon=");
      expect(response.status).toBe(400);
    });

    it("should not depend on order of query params", async () => {
      const response = await request.get("/weather?lon=40&lat=40");
      expect(response.status).toBe(200);
    });

    /**
     * DANGER: This test may cause other tests to fail since it modifies the environment variable and runs async.
     * It is best to run this test last.
     */
    it("should return an error for no API key", async () => {
      const prevApiKey = process.env.OPENWEATHER_API_KEY;
      process.env.OPENWEATHER_API_KEY = "";
      const response = await request.get("/weather?lat=40&lon=40");
      process.env.OPENWEATHER_API_KEY = prevApiKey;
      expect(response.status).toBe(400);
    });
  });
});
