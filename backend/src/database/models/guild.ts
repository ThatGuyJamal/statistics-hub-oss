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
    Premium: {
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
  BlackListed?: boolean;
  Premium?: GuildPremiumStruct;
  CreatedAt: Date;
}

export interface GuildPremiumStruct {
  enabled: boolean;
  tier: GuildSchemaPremiumTier;
  /**
 The ID of the user who activated the guild premium.
 */
  activatorId: string;
}

/**
 * Languages that can be used for the bot for translations.
 */
export const supportedLanguagesArray = [
  {
    name: "English",
    code: "en-US",
  },
  {
    name: "Spanish",
    code: "es-ES",
  },
];

export { GuildsMongoModel };
