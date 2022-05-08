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

import { GuildDocument, GuildDocumentModel } from "./guild.model";
import { WelcomeDocumentModel, WelcomePluginDocument } from "./plugins/welcome/welcome.plugin";
import { Collection, Guild } from "discord.js";
import { container } from "@sapphire/framework";
import { hours } from "../../utils/time";

export class GuildModelHandler {
  /** Model types for the main guild mongoose query's... */
  public CoreModel = GuildDocumentModel;
  public WelcomeModel = WelcomeDocumentModel;

  /** The local cache for quick setting information */
  public _cache = new Collection<string, GuildDocument>();
  public _welcomeCache = new Collection<string, WelcomePluginDocument>();

  public constructor() {
    /**
     * This will clear all cache entries every 24 hours.
     * This is to prevent the cache from growing too large and wipe inactivity guilds from the memory.
     */
    container.client.IntervalsController.start(
      "global-guild-cache-clear",
      () => {
        this._cache.clear();
      },
      hours(12)
    ).then(() => {
      container.logger.info("Global guild cache clear interval started!");
    });
  }

  /**
   * Saves all documents from the database to the cache
   * @returns
   */
  public async initCache() {
    // find all the documents in the db

    const guildsToCacheLimit = container.client.guilds.cache.size;

    if (guildsToCacheLimit < 100) {
      const documents = await this.CoreModel.find();

      if (documents) {
        // add them to the cache
        for (const doc of documents) this._cache.set(doc._id, doc);
        container.logger.info(
          `[GuildModelHandler] Loaded ${documents.length} guilds from the database into the cache.`
        );

        return documents;
      }

      return null;
    } else {
      container.logger.warn(
        `[GuildModelHandler] The guild cache limit is set to ${guildsToCacheLimit}, which is too high.`
      );
      return null;
    }
  }

  /**
   * Get a guild from the database.
   * @param guild The guild to get the settings for
   * @param type The type of document to find. Defaults to "guild"
   * @returns The guild settings for the given guild id or null if not found
   */
  public async getDocument(guild: Guild, type?: "welcome" | "guild") {
    if (!type) type = "guild";

    if (type === "guild") {
      const doc = await this.CoreModel.findById(guild.id);
      if (doc) this._cache.set(guild.id, doc);
      return doc
    } else if (type === "welcome") {
      const doc = await this.WelcomeModel.findById(guild.id);
      if (doc) this._welcomeCache.set(guild.id, doc);
      return doc
    }

    return null;
  }

  /**
   * Deletes a guild configuration from the database.
   * @param id Guild ID
   */
  public async wipe(id: string) {
    this._cache.delete(id);
    return this.CoreModel.findByIdAndDelete(id);
  }
}
