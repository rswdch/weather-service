import express, { Request } from "express";
import { getOpenWeather, parseWeatherConditions, validateCoords } from "./weather.service";

const router = express.Router();

interface WeatherRequestQuery {
  lat: string;
  lon: string;
}

/**
 * GET /weather?lat={latitude}&lon={longitude}
 */
router.get("/", async (req: Request<{}, {}, {}, WeatherRequestQuery>, res, next) => {
  try {
    const { lat, lon } = req.query;
    const { latNum, lonNum } = await validateCoords(lat, lon);
    const openWeatherData: any = await getOpenWeather(latNum, lonNum);
    const response = parseWeatherConditions(openWeatherData);
    res.status(200).json(response);
  } catch (err: any) {
    next(err);
  }
});

export default router;
