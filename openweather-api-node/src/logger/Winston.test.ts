import { logger } from "./WinstonLogger";
// import * as fs from "fs/promises";
import * as fs from "fs";
import * as path from "node:path";

describe('Winston logging tests', () => {
  const rootDir = process.cwd();

  // cleanup
  afterAll(() => {
    try {
        fs.openSync(path.resolve(rootDir, 'info.log'), 'w');
        fs.openSync(path.resolve(rootDir, 'warning.log'), 'w');
        console.log('File deleted successfully');
    } catch (err: any) {
        console.error(`Error deleting file: ${err.message}`);
    }
  })

  test('should log to warning.log locally', () => {
    const message = 'testing local logging to file'
    logger.warn(message);

    const logFile = path.resolve(rootDir, 'warn.log');
    const data = fs.readFileSync(logFile, 'utf8');
    const lines = data.split(/\r?\n/);
    const lastLine = lines[lines.length - 2];

    expect(lastLine.includes('warn')).toBeTruthy();
    expect(lastLine.includes(message)).toBeTruthy();
  });

  test('should log to info.log locally', () => {
    const message = 'testing local logging to file'
    logger.info(message);

    const logFile = path.resolve(rootDir, 'info.log');
    logger.info(message);
    const data = fs.readFileSync(logFile, 'utf8');
    const lines = data.split(/\r?\n/);
    const lastLine = lines[lines.length - 2];

    expect(lastLine.includes('info')).toBeTruthy();
    expect(lastLine.includes(message)).toBeTruthy();
  });
})
