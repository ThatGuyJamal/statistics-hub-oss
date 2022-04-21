/**
 *  Statistics Hub OSS - A data analytics discord bot.
    
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

import { container } from "@sapphire/framework";
import { connect, connection } from "mongoose";
import { ENV } from "../../config";

export async function initializeTypeGooseConnection() {
  try {
    await connect(ENV.database.mongodb_url);
  } catch (err) {
    container.logger.error(err);
  }
}

connection.on("error", (err) => {
  container.logger.error(err);
});

connection.on("disconnected", () => {
  container.logger.error(`Mongoose connection disconnected!`);
});

connection.on("disconnecting", () => {
  container.logger.info(`Mongoose is disconnecting...`);
});

connection.on("connecting", () => {
  container.logger.info(`Mongoose connection loading...`);
});

connection.on("connected", () => {
  container.logger.info(`Mongoose has connected @${ENV.database.mongodb_url}`);
});

connection.on("close", () => {
  container.logger.info(`Mongoose connection closed!`);
});
