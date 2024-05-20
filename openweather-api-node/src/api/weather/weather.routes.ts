import express, { Request } from "express";
import { getOpenWeather, validateCoords } from "./weather.service";

const router = express.Router();

interface WeatherRequestQuery {
  lat: string;
  lon: string;
}

router.get("/", async (req: Request<{}, {}, {}, WeatherRequestQuery>, res, next) => {
  try {
    const { lat, lon } = req.query;
    const { latNum, lonNum } = await validateCoords(lat, lon);
    const openWeatherData: any = await getOpenWeather(latNum, lonNum);
    // TODO return weather
    res.status(200).json(openWeatherData);

  } catch (err: any) {
    next(err);
  }
});

export default router;
