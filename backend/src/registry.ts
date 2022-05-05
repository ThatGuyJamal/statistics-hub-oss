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

import { startBot } from "discordeno"
import { environment } from "./config";
import { Client } from "./Client";

async function bootstrap(): Promise<void> {
  console.clear();

  const command = {
    name: "ping",
    description: "Retrieves the Bot latency",
    options: [],
  };

  await Client.helpers.createApplicationCommand(command, BigInt(environment.bot.test_guild_id))

  await startBot(Client)
}

bootstrap()
  .then(() => {
    console.info("Bootstrap complete! All services are online!");
  })
  .catch((err) => {
    console.error(err);
  });

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("rejectionHandled", (error) => {
  console.error("Promise rejection handled:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.warn(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
  console.error(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.warn(" [antiCrash] :: Multiple Resolves");
  console.error(type, promise, reason);
});

process.on("exit", (code) => {
  console.info(`Exiting with code ${code}`);
});
