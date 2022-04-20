import { IMemberCache } from "../lib/controllers/cache/memberCache";
import { IMessageCache } from "../lib/controllers/cache/messageCache";
import { IntervalsController } from "../lib/controllers/interval";
import { IEventLogger } from "../lib/controllers/statistics/logger";
import { StatisticsHandler } from "../lib/controllers/statistics/statcord";
import { GuildModelHandler } from "../lib/database/guild/handler";
import { env_types } from "./env";

/** Type over-writes, so we get typings in our client extensions. */
declare module "discord.js" {
  interface Client {
    /** Our custom environment variables  */
    environment: env_types;
    embed: MessageEmbed;
    /** Our database handler for guilds */
    GuildSettingsModel: GuildModelHandler;
    EventLogger: IEventLogger;
    StatisticsHandler: StatisticsHandler;
    IntervalsController: IntervalsController;
    /** A collection of cache controllers */
    TemporaryCaches: {
      MessageCache: IMessageCache;
      MemberCache: IMemberCache;
    };
    // Sets
    BotDevelopers: Set<string>;
    BotSupporters: Set<string>;
    BotStaff: Set<string>;
  }
}

/** Over-writes the default types for the Preconditions */
declare module "@sapphire/framework" {
  interface Preconditions {
    development: never;
    OwnerOnly: never;
  }
}
