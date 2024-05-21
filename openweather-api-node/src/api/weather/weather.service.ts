import { logger } from "../../logger/WinstonLogger";
import { z } from "zod";
import dotenv from "dotenv";
import { MiddlewareError } from "../..";
dotenv.config();

const latSchema = z.number().gte(-90).lte(90);
const lonSchema = z.number().gte(-180).lte(180);

/**
 * Validate latitude and longitude coordinates, converting to number upon success.
 * @param {string} lat latitude, decimal between [-90, 90]
 * @param {string} lon longitude, decimal between [-180, 180]
 * @returns { latNum: number, lonNum: number }
 */
export async function validateCoords(lat: string, lon: string) {
  try {
    const latNum = latSchema.parse(Number(lat));
    const lonNum = lonSchema.parse(Number(lon));
    return { latNum, lonNum };
  } catch (err: any) {
    logger.error("Error: invalid lat or lon.");
    const validationError: MiddlewareError = new Error(
      "Invalid coordinates in request query."
    );
    validationError.status = 400;
    throw validationError;
  }
}

/**
 * Fetches data from OpenWeather OneCall API. Temperature is fetched in celsius.
 * @param {number} lat between [-90, 90]
 * @param {number} lon between [-180, 180]
 * @returns OpenWeather OneCall API response data: https://openweathermap.org/api/one-call-3#parameter
 */
export async function getOpenWeather(lat: number, lon: number) {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
      const err: MiddlewareError = new Error("OpenWeather API key not found.");
      err.status = 400;
      throw err;
    }

    const BASE_URL = "https://api.openweathermap.org/data/3.0/onecall";

    let data: any = await fetch(
      `${BASE_URL}?units=metric&exclude=minutely,hourly,daily&lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    // OpenWeather API will not return cod if successful
    if (data.cod) {
      throw new Error(
        "An error occurred fetching from OpenWeather OneCall API."
      );
    }

    const res = await data.json();
    logger.info("OpenWeather API response:");
    logger.info(JSON.stringify(res));
    return res;
  } catch (err: any) {
    throw err;
  }
}

/**
 * Maps OpenWeather API response to API format.
 *
 * - conditions is an array of objects with shortDesc and longDesc.
 *
 * - There can be multiple conditions, as documented: https://samples.openweathermap.org/data/2.5/find?q=London&appid=b1b15e88fa797225412429c1c50c122a1r
 *
 * - alerts is either an empty array or an array of objects.
 *
 * - feeling can be hot (> 27C/80F), cold (< 15C/59F), or moderate.
 *
 * - temperature is given in celsius.
 *
 * - units are always metric for documentation.
 * @param openWeatherData parsed object from OpenWeather OneCall 3.0 API
 * @returns API format response object
 */
export function parseWeatherConditions(openWeatherData: any): WeatherResponse {
  try {
    if (!openWeatherData.current || !openWeatherData.current.weather) {
      throw new Error(
        "OpenWeather API data does not contain current weather conditions."
      );
    }

    const current = openWeatherData.current;

    const conditions = current.weather.map((singleCondition: any) => {
      return {
        shortDesc: singleCondition.main,
        longDesc: singleCondition.description,
      };
    });

    const temperature = z.number().parse(current.temp);
    // Feeling hot, cold, or moderate, based on developer's discretion
    const feeling = classifyTemp(temperature);

    const alerts = openWeatherData.alerts ? openWeatherData.alerts.map((alert: any) => {
      return {
        event: alert.event,
        description: alert.description,
      };
    }) : [];
    const units = "metric";

    return { feeling, conditions, alerts, temperature, units };
  } catch (err: any) {
    logger.error("Error converting OpenWeather API response to API format.");
    throw err;
  }
}

/**
 * Classify a temperature in Celsius as hot, cold, or moderate based on developer discretion.
 * @param temperature Temperature in Celsius
 * @returns hot, cold, or moderate
 */
export function classifyTemp(temperature: number): WeatherResponse["feeling"] {
  return temperature > 27 ? "hot" : temperature < 15 ? "cold" : "moderate";
}

export interface WeatherResponse {
  feeling: "hot" | "cold" | "moderate";
  temperature: number; // OneCall current.temp
  conditions: Array<OpenWeatherCondition>; // OneCall current.weather: Array
  alerts: Array<OpenWeatherAlert>; // OneCall
  units: "metric" | "imperial" | "standard";
}

export interface OpenWeatherCondition {
  main: string;
  description: string;
}

export interface OpenWeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
}
