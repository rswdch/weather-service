import express, { Request, Response } from 'express';
import { logger } from './logger/WinstonLogger';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
  logger.info('this is an info log');
  logger.debug('this is a debug log from /');
  res.send("Hello world").status(200).end();
})

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
})
