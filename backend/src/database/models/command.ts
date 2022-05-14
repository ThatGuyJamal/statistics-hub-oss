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

export const CommandPluginMongoModel = mongo.model(
  "commands-plugin",
  new mongo.Schema<CommandModelStructure>({
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
    GuildDisabledCommands: {
      type: Array,
      required: false,
      default: null,
    },
    GuildDisabledCommandChannels: {
      type: Array,
      required: false,
      default: null,
    },
    GuildCustomCommands: {
      type: Object,
      required: false,
      default: {
        data: [],
        limit: 5,
      },
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
export interface CommandModelStructure {
  GuildId: string;
  GuildName?: string;
  GuildOwnerId?: string;
  GuildDisabledCommands?: string[];
  GuildDisabledCommandChannels?: string[];
  /**
   * Custom Command Structure
   */
  GuildCustomCommands?: {
    /** Command data */
    data: CustomCommandSchema[];
    /** Max number of commands this guild can have.*/
    limit: number;
  };
  CreatedAt: Date;
}

/**
 * Typings for our custom command schema
 */
export interface CustomCommandSchema {
  /**
   * The regex pattern to match the command.
   */
  trigger: string;
  /**
   * The message to send when the command is triggered.
   */
  response: string;
  /**
   * The channel this custom command is allowed to be used in. If null, it can be used in any channel.
   */
  allowedChannel: string | null
  /**
   * The users who can use this command. If null, it can be used by anyone.
   */
  allowedUser: string | null
  /**
   * The roles that can use this command. If null, it can be used by anyone.
   */
  allowedRole: string | null
}

export enum CommandPluginEnum {
  /**
   * The max allowed commands for non premium guilds.
   */
  commandLimit = 5,
}
