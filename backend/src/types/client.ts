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

import { IMemberCache } from "../lib/controllers/cache/memberCache";
import { IMessageCache } from "../lib/controllers/cache/messageCache";
import { IntervalsController } from "../lib/controllers/interval";
import { IEventLogger } from "../lib/controllers/statistics/logger";
import { StatisticsHandler } from "../lib/controllers/statistics/statcord";
import { GuildModelHandler } from "../lib/database/guild/guild.handler";
import { env_types } from "./env";
import { RedisController } from "../lib/controllers/redis";

/** Type over-writes, so we get typings in our client extensions. */
declare module "discord.js" {
  interface Client {
    /** Our custom environment variables  */
    environment: env_types;
    embed: MessageEmbed;
    /** Our database handler for guilds */
    GuildSettingsModel: GuildModelHandler;
    EventLogger: IEventLogger;
    StatisticsHandler: StatisticsHandler;
    IntervalsController: IntervalsController;
    /** A collection of cache controllers */
    TemporaryCaches: {
      MessageCache: IMessageCache;
      MemberCache: IMemberCache;
    };
    // Sets
    BotDevelopers: Set<string>;
    BotSupporters: Set<string>;
    BotStaff: Set<string>;
    // redis
    RedisController: RedisController;
  }
}

/** Over-writes the default types for the Preconditions */
declare module "@sapphire/framework" {
  interface Preconditions {
    development: never;
    OwnerOnly: never;
  }
}

declare module "@sapphire/pieces" {
  interface Container {}
}
