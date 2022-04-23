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

import { getModelForClass, modelOptions, prop, Severity } from "@typegoose/typegoose";
import { GuildSchemaPremiumTier } from "../user/user.model";

@modelOptions({
  schemaOptions: {
    id: false,
    collection: "guilds",
  },
  options: {
    allowMixed: Severity.ALLOW,
    runSyncIndexes: true,
  },
})
export class GuildDocument {
  @prop({ type: () => String, required: true })
  /**
   * Guild ID
   */
  public _id?: string;

  /**
   * The name of the guild
   */
  @prop({ type: () => String, required: false, default: null })
  public guild_name?: string;

  @prop({ type: () => String, required: false, default: "sh!" })
  public prefix?: string;

  @prop({ type: () => String, required: false, default: "en-US" })
  /**
   * The guild's language config
   */
  public language?: string;

  @prop({ type: () => Boolean, required: false, default: false })
  /**
   * The guild's blacklist status
   */
  public blacklisted?: boolean;

  /**
   * The guild's tracking data
   */
  @prop({ type: () => Object, required: false, default: null })
  public data?: GuildSchema;

  /**
   * A list of all disabled commands for this guild
   */
  @prop({ type: () => String, required: false, default: null })
  public disabled_commands?: string[];
}

export const GuildDocumentModel = getModelForClass(GuildDocument);

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
