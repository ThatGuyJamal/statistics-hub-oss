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

import { modelOptions, prop, Severity } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    id: false,
    collection: "users",
  },
  options: {
    allowMixed: Severity.ALLOW,
    runSyncIndexes: true,
  },
})
export class UserDocument {
  @prop({ type: () => String, required: true })
  /**
   * User ID
   */
  public _id?: string;

  /**
   * The name of the user
   */
  @prop({ type: () => String, required: false, default: null })
  public username?: string;

  @prop({ type: () => String, required: false, default: null })
  premium?: GuildSchemaPremiumType;
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
