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

const UsersMongoModel = mongo.model(
  "users",
  new mongo.Schema<UserModelStructure>({
    UserId: {
      type: String,
      required: true,
      unique: true,
    },
    UserName: {
      type: String,
      required: false,
      default: null,
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
  })
);

export interface UserModelStructure {
  UserId: string;
  UserName?: string;
  BlackListed: boolean;
  Premium?: GuildSchemaPremiumType;
}

/**
 * Typings for guild premium data structure
 */
export interface GuildSchemaPremiumType {
  /**
   * payment ID from our provider after payment.
   * This will be used for other authentication methods in the future.
   */
  paymentId: string;
  /** The guild's premium status */
  status: boolean;
  /** The guild's premium tier */
  tier: GuildSchemaPremiumTier;
  /**
   * How many guilds they can have premium in total
   */
  total_guilds_enabled: number;
  /**
   * Id of the guild they have active premium in
   */
  guilds_enabled_ids: string[];

  /**
   * When the user's premium expires
   * @default 1 month
   **/
  expiresAt: Date;
}

/**
 * Model for our premium tier data.
 */
export enum GuildSchemaPremiumTier {
  NONE = 0,
  BRONZE = 1,
  SILVER = 2,
  GOLD = 3,
}

export { UsersMongoModel };
