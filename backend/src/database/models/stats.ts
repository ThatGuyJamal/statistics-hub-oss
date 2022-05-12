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

import type { Channel } from "discord.js";
import mongo from "mongoose";

export const StatsMongoModel = mongo.model(
  "stats",
  new mongo.Schema<StatsModelStructure>({
    GuildId: {
      type: String,
      required: true,
      unique: true,
    },
    GuildName: {
      type: String,
      required: false,
      default: null,
    },
    GuildOwnerId: {
      type: String,
      required: false,
      default: null,
    },
    GuildMember: {
      type: Object,
      required: false,
      default: null,
    },
    GuildChannel: {
      type: Object,
      required: false,
      default: null,
    },
    GuildVoice: {
      type: Object,
      required: false,
      default: null,
    },
    CreatedAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
  })
);

/**
 * Typings for our mongoose document
 */
export interface StatsModelStructure {
  GuildId: string;
  GuildName?: string;
  GuildOwnerId?: string;
  GuildMember?: GuildSchemaMemberType;
  GuildMessage?: GuildSchemaMessageType;
  GuildChannel?: GuildSchemaChannelType;
  GuildVoice?: GuildSchemaVoiceType;
  CreatedAt: Date;
}

/**
 * Typings for member data structure
 */
export interface GuildSchemaMemberType {
  guildJoins?: number;
  guildLeaves?: number;
  /** The last time a member joined the server. */
  lastJoin?: Date;
  guildBans?: number;
}

/**
 * Typings for message data structure
 */
export interface GuildSchemaMessageType {
  most_active_channels: Channel[];
  most_active_users: string[];
  message_count: number;
}

/**
 * Typings for voice channel data structure
 */
export interface GuildSchemaVoiceType {
  most_active_channels: Channel[];
  most_active_users: string[];
  message_count: number;
}

/**
 * Typings for guild channel data structure
 */
export interface GuildSchemaChannelType {
  created: number;
  deleted: number;
}
