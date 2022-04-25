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
import type { GuildSchema } from "./guild/guild.model";
import { WelcomeCardOptions, WelcomeEmbedObject } from "./guild/plugins/welcome/welcome.plugin";

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
  },
  disabled_commands: [],
} as GuildSchema;

/**
 * The default object for the user database schema creation object.
 */
export const DefaultUserModelObject = {
  paymentId: undefined,
  status: false,
  tier: 0,
  total_guilds_enabled: 0,
};

/**
 * The default props used in the welcome embed option
 */
export const DefaultWelcomeEmbed = {
  title: "Welcome to the server!",
  description: "Welcome to the server {user}! Please read the rules and have fun!",
  color: "#00ff00",
  timestamp: true,
} as WelcomeEmbedObject;

/**
 * The default props used in the welcome message
 */
export const DefaultWelcomeMessage = `Welcome to the server {user}! Please read the rules and have fun!`;

/**
 * The default props used in the welcome card options
 */
export const DefaultWelcomeCard = {
  theme: "dark",
  text: {
    title: "Welcome to the server!",
    // This will be replaced with the real user tag when the message is sent
    text: `{userTag}`,
    subtitle: `Please read the rules and have fun!`,
    color: "#00ff00",
  },
  avatar: {
    url: "https://i.imgur.com/ZOKp8LH.png",
    outlineWidth: 0,
  },
  card: {
    blur: 1,
    border: true,
    rounded: true,
  },
} as WelcomeCardOptions;
