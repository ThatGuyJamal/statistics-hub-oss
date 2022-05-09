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
import { Collection } from "discord.js";
import { type GuildModelStructure, GuildsMongoModel } from "../database/models/guild";
import { type UserModelStructure, UsersMongoModel } from "../database/models/user";

/**
 * Controls the cache for guilds, users, and other data.
 */
export class LocalCacheStore {
  /** Our memory object. */
  public memory = {
    guild: {
      cache: new Collection<string, GuildModelStructure>(),
      /**
       * Gets a value from the cache.
       * @param id The id of the guild.
       * @returns {GuildModelStructure | undefined} The guild or undefined if not found.
       */
      get: (id: string): GuildModelStructure | undefined => {
        return this.memory.guild.cache.get(id);
      },
      /**
       * Sets a value in the cache.
       * @param id The id of the guild.
       * @param value The guild to set.
       * @returns {GuildModelStructure | undefined} The guild or undefined if not found.
        */
      set: (id: string, value: GuildModelStructure) => {
        return this.memory.guild.cache.set(id, value);
      },
      /**
       * Removes a value from the cache.
       * @param id The id of the guild.
       */ 
      delete: (id: string) => {
        return this.memory.guild.cache.delete(id);
      }
    },
    user: {
      cache: new Collection<string, UserModelStructure>(),
      /**
       * Gets a value from the cache.
       * @param id The id of the user.
       * @returns {UserModelStructure | undefined} The user or undefined if not found.
       */
      get: (id: string): UserModelStructure | undefined => {
        return this.memory.user.cache.get(id);
      },
      /**
       * Sets a value in the cache.
       * @param id The id of the user.
       * @param value The user to set.
       * @returns {UserModelStructure | undefined} The user or undefined if not found.
        */
      set: (id: string, value: UserModelStructure) => {
        return this.memory.user.cache.set(id, value);
      },
      /**
       * Removes a value from the cache.
       * @param id The id of the user.
       */
      delete: (id: string) => {
        return this.memory.user.cache.delete(id);
      }
    }
  };

  /**
   * Initializes the cache store.
   * @returns {Promise<void>}
   */
  public async init(): Promise<void> {
    // Find all the data in both models
    const guild = await GuildsMongoModel.find({});
    const user = await UsersMongoModel.find({});

    if (!guild.length) container.logger.warn("No guilds found in the database.");
    if (!user.length) container.logger.warn("No users found in the database.");

    // Add the data to the memory
    for (const g of guild) {
      this.memory.guild.set(g.GuildId, g);
      container.logger.debug(`Added guild ${g.GuildId} to the cache.`);
    }

    for (const u of user) {
      this.memory.user.set(u.UserId, u);
      container.logger.debug(`Added user ${u.UserId} to the cache.`);
    }

    container.logger.info(
      "Loaded " + guild.length + " guilds and " + user.length + " users from the database into the local cache."
    );
  }

  /**
   * @returns {number} The total size of the cache.
   */
  public get size(): number {
    return this.memory.guild.cache.size + this.memory.user.cache.size;
  }
}
