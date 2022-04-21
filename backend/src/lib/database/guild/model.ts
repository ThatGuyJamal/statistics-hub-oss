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
  @prop({ type: () => Object, required: false, default: undefined })
  public data?: GuildSchema;
}

export const GuildDocumentModel = getModelForClass(GuildDocument);

/** Typings for guild schema */
export interface GuildSchema {
  /** Tracks the guild member message activity */
  message?: number;
  /** Tracks the member join rates */
  member?: GuildSchemaMemberType;
  voice?: number;
  channel?: GuildSchemaChannelType;
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

/**
 * The default data object for the database schema creation object.
 */
export const DefaultDataModelObject = {
  member: {
    guildJoins: 0,
    guildLeaves: 0,
    lastJoin: undefined,
    guildBans: 0,
  },
  message: 1,
  voice: 0,
  channel: {
    created: 0,
    deleted: 0,
  },
} as GuildSchema
