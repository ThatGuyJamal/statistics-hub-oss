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
import { Collection, Guild, GuildMember } from "discord.js";
import { CommandModelStructure } from "../database/models/command";
import { type GuildModelStructure, GuildsMongoModel } from "../database/models/guild";
import { WelcomePluginModelStructure, WelcomePluginMongoModel } from "../database/models/plugins/welcome/welcome";
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
      get: (guild: Guild): GuildModelStructure | undefined => {
        return this.memory.guild.cache.get(guild.id);
      },
      /**
       * Sets a value in the cache.
       * @param id The id of the guild.
       * @param value The guild to set.
       * @returns {GuildModelStructure | undefined} The guild or undefined if not found.
       */
      set: (guild: Guild, value: GuildModelStructure) => {
        return this.memory.guild.cache.set(guild.id, value);
      },
      /**
       * Removes a value from the cache.
       * @param id The id of the guild.
       * @returns {boolean} Whether or not the guild was removed.
       */
      delete: (guild: Guild) => {
        return this.memory.guild.cache.delete(guild.id);
      },
    },
    user: {
      cache: new Collection<string, UserModelStructure>(),
      /**
       * Gets a value from the cache.
       * @param id The id of the user.
       * @returns {UserModelStructure | undefined} The user or undefined if not found.
       * @memberof LocalCacheStore
       */
      get: (user: GuildMember): UserModelStructure | undefined => {
        return this.memory.user.cache.get(user.id);
      },
      /**
       * Sets a value in the cache.
       * @param id The id of the user.
       * @param value The user to set.
       * @returns {UserModelStructure | undefined} The user or undefined if not found.
       * @memberof LocalCacheStore
       */
      set: (user: GuildMember, value: UserModelStructure) => {
        return this.memory.user.cache.set(user.id, value);
      },
      /**
       * Removes a value from the cache.
       * @param id The id of the user.
       */
      delete: (user: GuildMember) => {
        return this.memory.user.cache.delete(user.id);
      },
    },
    plugins: {
      welcome: {
        cache: new Collection<string, WelcomePluginModelStructure>(),
        /**
         * Gets a value from the cache.
         * @param id The id of the guild.
         * @returns {WelcomePluginModelStructure | undefined} The guild data or undefined if not found.
         */
        get: (guild: Guild): WelcomePluginModelStructure | undefined => {
          return this.memory.plugins.welcome.cache.get(guild.id);
        },
        /**
         * Sets a value in the cache.
         * @param id The id of the guild.
         * @param value The guild data to set.
         * @returns {WelcomePluginModelStructure | undefined} The guild data or undefined if not found.
         * @memberof LocalCacheStore
         */
        set: (guild: Guild, value: WelcomePluginModelStructure) => {
          return this.memory.plugins.welcome.cache.set(guild.id, value);
        },
        /**
         * Removes a value from the cache.
         * @param id The id of the guild.
         * @returns {WelcomePluginModelStructure | undefined} The guild data or undefined if not found.
         * @memberof LocalCacheStore
         */
        delete: (guild: Guild) => {
          return this.memory.plugins.welcome.cache.delete(guild.id);
        },
      },
      commands: {
        cache: new Collection<string, CommandModelStructure>(),
        /**
         * Gets a value from the cache.
         * @param id The id of the guild.
         * @returns {CommandModelStructure | undefined} The guild data or undefined if not found.
         * @memberof LocalCacheStore
         */
        get: (guild: Guild): CommandModelStructure | undefined => {
          return this.memory.plugins.commands.cache.get(guild.id);
        },
        /**
         * Sets a value in the cache.
         * @param id The id of the guild.
         * @param value The guild data to set.
         * @returns {CommandModelStructure | undefined} The guild data or undefined if not found.
         * @memberof LocalCacheStore
         */
        set: (guild: Guild, value: CommandModelStructure) => {
          return this.memory.plugins.commands.cache.set(guild.id, value);
        },
        /**
         * Removes a value from the cache.
         * @param id The id of the guild.
         * @returns {CommandModelStructure | undefined} The guild data or undefined if not found.
         * @memberof LocalCacheStore
         */
        delete: (guild: Guild) => {
          return this.memory.plugins.commands.cache.delete(guild.id);
        },
      },
    },
  };

  /**
   * Initializes the cache store.
   * @returns {Promise<void>}
   */
  public async init(): Promise<void> {
    // Find all the data in both models
    const guild = await GuildsMongoModel.find({});
    const user = await UsersMongoModel.find({});
    const welcome = await WelcomePluginMongoModel.find({});

    if (!guild.length) container.logger.warn("No guilds found in the database.");
    if (!user.length) container.logger.warn("No users found in the database.");
    if (!welcome.length) container.logger.warn("No welcome plugins found in the database.");

    // Add the data to the memory
    for (const g of guild) {
      this.memory.guild.cache.set(g.GuildId, g);
      if (!container.client.environment.production)
        container.logger.debug(`Added guild ${g.GuildId} to the cache.\n ${g}`);
    }

    for (const u of user) {
      this.memory.user.cache.set(u.UserId, u);
      if (!container.client.environment.production)
        container.logger.debug(`Added user ${u.UserId} to the cache.\n ${u}`);
    }

    for (const w of welcome) {
      this.memory.plugins.welcome.cache.set(w.GuildId, w);
      if (!container.client.environment.production)
        container.logger.debug(`Added welcome plugin ${w.GuildId} to the cache.\n ${w}`);
    }

    // Log the amount of data
    container.logger.info(
      `Loaded ${guild.length} guilds, ${user.length} users, and ${welcome.length} welcome plugins.`
    );
  }

  /**
   * @returns {number} The total size of the cache.
   */
  public get size(): number {
    return this.memory.guild.cache.size + this.memory.user.cache.size + this.memory.plugins.welcome.cache.size;
  }
}
