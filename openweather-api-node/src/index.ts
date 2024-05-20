import express, { Request, Response, NextFunction } from "express";
import { logger } from "./logger/WinstonLogger";
import weatherRouter from "./api/weather/weather.routes";
import * as expressWinston from "express-winston";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    // statusLevels: true,
    level: "http",
  })
);

app.get("/", (_req: Request, res: Response) => {
  logger.info("this is an info log");
  logger.debug("this is a debug log from /");
  res.send("Hello world").status(200).end();
});

app.use("/weather", weatherRouter);

app.get("/error", () => {
  throw new Error("custom error");
});

// Express Winston error logger middleware
app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
    level: "error",
  })
);

// 404 error handler
app.use((req, res, next) => {
  res.status(404).send("Error 404: Page not found.");
});

// global error handler
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    const defaultError = {
      log: "Express error handler caught unknown middleware error",
      status: 500,
      message: { err: "An error occurred" },
    };

    // add custom error message and stack trace if available
    const errorObj = {
      ...defaultError,
      ...err,
      ...(err instanceof Error
        ? { message: { err: err.message }, stack: err.stack }
        : err),
    };

    logger.debug(errorObj.stack);

    res.status(errorObj.status).json(errorObj.message);
  }
);

export interface MiddlewareError extends Error {
  status?: number;
}

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
