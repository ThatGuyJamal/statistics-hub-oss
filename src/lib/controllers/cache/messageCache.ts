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
import { Guild } from "discord.js";
import { BaseCache } from "./cache";

export class IMessageCache extends BaseCache {
  /** The map of the cache */
  public collection: Map<string, number>;

  public constructor() {
    super();
    this.collection = new Map();

    // setInterval(async () => {
    //   for (const guilds of container.client.guilds.cache.values()) {
    //     const cachedData = this.collection.get(guilds.id);
    //     if (!cachedData) return container.logger.warn(`[Message Cache] ${guilds.name} is not cached.`);
    //     else {
    //       const o = await container.client.GuildSettingsModel._model.findById(guilds.id)

    //       await container.client.GuildSettingsModel._model
    //         .findOneAndUpdate(
    //           { _id: guilds.id },
    //           {
    //             $set: {
    //               guild_name: guilds.name,
    //               data: {
    //                 messages: cachedData + (o!.data!.message ?? 0),
    //               },
    //             },
    //           },
    //           {
    //             upsert: true,
    //             new: true,
    //           }
    //           // After running the query to the db, we need to clear the cache so we can upload new data...
    //         )
    //         .exec()
    //         .then(() => container.logger.info(`Saved message data for ${guilds.name} to the database.`))
    //         .then(() => this.collection.delete(guilds.id));
    //     }
    //   }
    // }, minutes(2));
  }

  /**
   * Saves the data
   * @param guild The Guild Object.
   * @returns {Map<string, number>} A map of the new cache
   */
  public save(guild: Guild, value: number): Map<string, number> {
    const oldCache: number | undefined = this.collection.get(guild.id);
    let result: number;
    if (!oldCache) {
      result = value;
      container.logger.info(`[Message Cache] ${result} was saved to the cache.`);
      // If there is no cache already, we will save the new value into the cache
      return this.collection.set(guild.id, result);
    } else {
      result = value + oldCache;
      container.logger.info(`[Message Cache] ${result} was saved to the cache.`);
      // If there is old cache, we will add that result to the updated value and re-save them.
      return this.collection.set(guild.id, result);
    }
  }

  /** Returns the size of the cache. */
  public get size() {
    return this.collection.size;
  }
}
