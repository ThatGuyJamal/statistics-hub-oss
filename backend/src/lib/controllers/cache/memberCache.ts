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

import { Guild } from "discord.js";
import { GuildSchemaMemberType } from "../../database/guild/guild.model";
import { BaseCache } from "./cache";

type MemberDataType = "guildJoins" | "guildLeaves" | "lastJoin" | "guildBans";

export class IMemberCache extends BaseCache {
  /** The map of the cache */
  public collection: Map<string, GuildSchemaMemberType>;

  public constructor() {
    super();
    this.collection = new Map();
  }
  /** Returns the size of the cache. */
  public get size() {
    return this.collection.size;
  }
}
