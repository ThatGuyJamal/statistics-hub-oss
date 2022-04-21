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
  export class GuildDocument {
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
    premium?: GuildSchemaPremiumType
  }

  /**
 * Typings for guild premium data structure
 */
export interface GuildSchemaPremiumType {
    /** The guild's premium status */
    status: boolean;
    /** The guild's premium tier */
    tier: GuildSchemaPremiumTier;
    /**
     * How many guilds they can have premium in total
     */
    total: number;
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