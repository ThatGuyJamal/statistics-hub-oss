/**
  Statistics Hub OSS - A data analytics discord bot.
    
  Copyright (C) 2022, ThatGuyJamal and contributors

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Affero General Public License for more details.
 */

import { Logger } from "./utils/logger";
import { environment } from "./config";

async function bootstrap(): Promise<void> {
  Logger.clear();

  try {
    
  }
  catch (error: any) {
    Logger.error(error);
  }
}

bootstrap()
  .then(() => {
    Logger.success("Bootstrap complete! All services are online!");
  })
  .catch((err) => {
    Logger.error(err);
  });

process.on("unhandledRejection", (error) => {
  Logger.error(`Unhandled promise rejection: ${error}`);
});

process.on("rejectionHandled", (error) => {
  Logger.error(`Promise rejection handled: ${error}`);
});

process.on("uncaughtException", (error) => {
  Logger.error(`Uncaught exception: ${error}`);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  Logger.warn(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
  Logger.error(`${err}`);
  Logger.error(origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  Logger.warn(" [antiCrash] :: Multiple Resolves");
  Logger.error(`${type} :: ${promise} :: ${reason}`);
});

process.on("exit", (code) => {
  Logger.info(`Exiting with code ${code}`);
});
