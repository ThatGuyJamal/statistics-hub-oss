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

import { connect, connection } from "mongoose";
import { environment } from "~/config.server";

export async function initializeTypeGooseConnection() {
  try {
    await connect(environment.mongodbUrl!);
  } catch (err) {
    console.error(err);
  }
}

connection.on("error", (err) => {
  console.error(err);
});

connection.on("disconnected", () => {
  console.error(`Mongoose connection disconnected!`);
});

connection.on("disconnecting", () => {
  console.info(`Mongoose is disconnecting...`);
});

connection.on("connecting", () => {
  console.info(`Mongoose connection loading...`);
});

connection.on("connected", () => {
  console.info(`Mongoose has connected to the database!`);
});

connection.on("close", () => {
  console.info(`Mongoose connection closed!`);
});
