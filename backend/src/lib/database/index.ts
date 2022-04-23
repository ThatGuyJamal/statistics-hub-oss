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
import { GuildSchema } from "./guild/guild.model";

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


/**
 * The default data object for the guild database schema creation object.
 */
 export const DefaultGuildDataModelObject = {
  member: {
    guildJoins: 0,
    guildLeaves: 0,
    lastJoin: undefined,
    guildBans: 0,
  },
  message: 0,
  voice: 0,
  channel: {
    created: 0,
    deleted: 0,
  }
} as GuildSchema

/**
 * The default object for the user database schema creation object.
 */
export const DefaultUserModelObject = {
  paymentId: undefined,
  status: false,
  tier: 0,
  total_guilds_enabled: 0
}