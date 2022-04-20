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

import { GuildDocument, GuildDocumentModel } from "./model";
import { Collection, Guild } from "discord.js";
import { container } from "@sapphire/framework";
import { days } from "../../utils/time";

export class GuildModelHandler {
  /** Model types for mongoose query's... */
  public _model = GuildDocumentModel;
  /** The local cache for quick setting information */
  public _cache = new Collection<string, GuildDocument>();

  public constructor() {
    setInterval(() => {
      this._cache.clear();
    }, days(1));
  }

  /**
   * Saves all documents from the database to the cache
   * @returns
   */
  public async initCache() {
    // find all the documents in the db

    const guildsToCacheLimit = container.client.guilds.cache.size;

    if (guildsToCacheLimit < 100) {
      const documents = await this._model.find();

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
   * Get a guild from the database
   * @param guild The guild to get the settings for
   * @returns The guild settings for the given guild id
   */
  public async getDocument(guild: Guild) {
    let doc;
    if (this._cache.has(guild.id)) {
      doc = this._cache.get(guild.id);
    } else {
      doc = await this._model.findById(guild.id);
      if (doc) this._cache.set(guild.id, doc);
    }
    return doc;
  }

  /**
   * Deletes a guild configuration from the database.
   * @param id Guild ID
   */
  public async wipe(id: string) {
    this._cache.delete(id);
    return this._model.findByIdAndDelete(id);
  }
}
