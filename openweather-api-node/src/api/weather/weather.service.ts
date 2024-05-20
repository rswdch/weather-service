import { logger } from "../../logger/WinstonLogger";
import { z } from "zod";
import dotenv from "dotenv";
import { MiddlewareError } from "../..";
dotenv.config();

const latSchema = z.number().gt(-90).lt(90);
const lonSchema = z.number().gt(-180).lt(180);

/**
 * Validate latitude and longitude coordinates, converting to number upon success.
 * @param {string} lat latitude, decimal between (-90, 90)
 * @param {string} lon longitude, decimal between (-180, 180)
 * @returns { latNum: number, lonNum: number }
 */
export async function validateCoords(lat: string, lon: string) {
  try {
    const latNum = latSchema.parse(Number(lat));
    const lonNum = lonSchema.parse(Number(lon));
    return { latNum, lonNum };
  } catch (err: any) {
    logger.error("Error: invalid lat or lon.");
    const validationError: MiddlewareError = new Error("Invalid coordinates in request query.");
    validationError.status = 400;
    throw validationError;
  }
}

/**
 * Fetches data from OpenWeather OneCall API.
 * @param {number} lat between (-90, 90)
 * @param {number} lon between (-180, 180)
 * @returns OpenWeather OneCall API response data: https://openweathermap.org/api/one-call-3#parameter
 */
export async function getOpenWeather(lat: number, lon: number) {
  console.log("getopenweather");
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const BASE_URL = "https://api.openweathermap.org/data/3.0/onecall";

  let data: any;
  try {
    data = await fetch(
      `${BASE_URL}?units=metric&exclude=minutely,hourly,daily&lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    if (data.cod) {
      throw new Error(
        "An error occurred fetching from OpenWeather OneCall API."
      );
    }

    const res = await data.json();
    logger.info(JSON.stringify(res));
    return res;
  } catch (err: any) {
    throw err;
  }
}

// TODO clarify Weather Service response object schema
export function parseWeatherConditions(openWeatherData: any) {}

interface WeatherResponse {
  conditions: Array<string>; // OneCall current.weather: Array
  alerts: Array<string>; // OneCall
}
