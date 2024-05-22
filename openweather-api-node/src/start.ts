import { app } from "./index";
import { logger } from "./logger/WinstonLogger";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});