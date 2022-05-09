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

import mongo from "mongoose";
import { GuildSchemaPremiumTier } from "./user";

const GuildsMongoModel = mongo.model(
  "guilds",
  new mongo.Schema<GuildModelStructure>({
    GuildId: {
      type: String,
      required: true,
      unique: true,
    },
    GuildName: {
      type: String,
      required: true,
      default: null,
    },
    GuildOwnerId: {
      type: String,
      required: false,
      default: null,
    },
    GuildPrefix: {
      type: String,
      required: false,
      default: null,
    },
    GuildLanguage: {
      type: String,
      required: false,
      default: "en-US",
    },
    BlackListed: {
      type: Boolean,
      required: false,
      default: false,
    },
    Data: {
      type: Object,
      required: false,
      default: null,
    },
    CreatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  })
);

/**
 * Typings for our mongoose document
 */
export interface GuildModelStructure {
  GuildId: string;
  GuildName?: string;
  GuildOwnerId?: string;
  GuildPrefix?: string;
  GuildLanguage?: string;
  BlackListed: boolean;
  Data?: GuildSchema;
  CreatedAt: Date;
}

/** Typings for guild schema */
export interface GuildSchema {
  /** Tracks the guild member message activity */
  message?: number;
  /** Tracks the member information*/
  member?: GuildSchemaMemberType;
  /** Tracks voice channel information */
  voice?: number;
  /** Tracks Channel information. */
  channel?: GuildSchemaChannelType;
  /**
   * Tracks the guild's premium status
   * This will require a guild owner to set this up. They will active the premium status for there
   * account and then can enable the guild.
   */
  premium?: {
    status: boolean;
    tier: GuildSchemaPremiumTier;
    /** Id of the guild owner who enabled this guild. */
    enabled_by: string;
  };
  disabled_commands?: string[];
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
 * Typings for guild channel data structure
 */
export interface GuildSchemaChannelType {
  created: number;
  deleted: number;
}

interface GuildBlackListSchema {
  isBlacklisted: boolean;
  reason?: string;
}

export { GuildsMongoModel };
