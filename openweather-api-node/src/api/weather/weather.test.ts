import dotenv from "dotenv";
import {
  validateCoords,
  getOpenWeather,
  parseWeatherConditions,
} from "./weather.service";

describe("Weather service tests", () => {
  beforeAll(() => {
    dotenv.config();
  });

  describe("validateCoords", () => {
    it("should validate coordinates", async () => {
      const lat = "37.7749";
      const lon = "-122.4194";
      const { latNum, lonNum } = await validateCoords(lat, lon);

      expect(latNum).toBe(37.7749);
      expect(lonNum).toBe(-122.4194);
    });

    it("should throw an error for invalid coordinates", async () => {
      const lat = "100";
      const lon = "200";

      try {
        await validateCoords(lat, lon);
      } catch (err: any) {
        expect(err.status).toBe(400);
        expect(err.message).toBe("Invalid coordinates in request query.");
      }
    });

    it("should throw an error for invalid types", async () => {
      const lat = "37.7749";
      const lon = "abc";

      try {
        await validateCoords(lat, lon);
      } catch (err: any) {
        expect(err.status).toBe(400);
      }
    });
  });

  describe("getOpenWeather", () => {
    it("should fetch data from OpenWeather API", async () => {
      const lat = 37.7749;
      const lon = -122.4194;
      const openWeatherData = await getOpenWeather(lat, lon);

      expect(openWeatherData).toBeDefined();
      expect(openWeatherData.current).toBeDefined();
      expect(openWeatherData.current.temp).toBeDefined();
    });
  });

  describe("parseWeatherConditions", () => {
    it("should parse OpenWeather API response", () => {
      const openWeatherData = {
        current: {
          temp: 20,
          weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
        },
      };

      const response = parseWeatherConditions(openWeatherData);
      console.log(response);
      expect(response).toEqual({
        feeling: "moderate",
        temperature: 20,
        conditions: [{ shortDesc: "Clear", longDesc: "clear sky" }],
        alerts: [],
        units: "metric",
      });
    });
  });
});
