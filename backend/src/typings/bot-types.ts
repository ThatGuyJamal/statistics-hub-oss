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

import { StatCordHandler } from "../api/statcord";
import { RedisController } from "../cache/redis";
import { LocalCacheStore } from "../cache/store";
import { environment } from "../config";
import { IntervalController } from "../controllers/interval";
import { CacheKeysEnum } from "./enum";

/** Type over-writes, so we get typings in our client extensions. */
declare module "discord.js" {
  interface Client {
    /** Our custom environment variables  */
    environment: typeof environment;
    // Cache
    RedisController: typeof RedisController;
    StatCordHandler: StatCordHandler;
    LocalCacheStore: LocalCacheStore;
    CacheKeys: CacheKeysEnum
    // Sets
    BotDevelopers: Set<string>;
    BotSupporters: Set<string>;
    BotStaff: Set<string>;

    IntervalController: IntervalController;
  }
}

/** Over-writes the default types for the Preconditions */
declare module "@sapphire/framework" {
  interface Preconditions {
    DevelopmentCommand: never;
    OwnerOnlyCommand: never;
  }
}

declare module "@sapphire/pieces" {
  interface Container {}
}
