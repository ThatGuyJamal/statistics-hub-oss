import { LogLevel, container } from "@sapphire/framework";
import { ClientOptions, Message, Options, Sweepers } from "discord.js";
import { ENV } from "../../config";
import { parseInternationalizationOptions } from "../il8n/function";
import { isGuildMessage } from "../utils/guards";
import { hours, minutes, seconds } from "../utils/time";

export const CLIENT_OPTIONS: ClientOptions = {
  shards: "auto",
  shardCount: 1,
  caseInsensitiveCommands: true,
  caseInsensitivePrefixes: true,
  defaultPrefix: ENV.bot.prefix,
  logger: {
    level: ENV.bot.dev ? LogLevel.Debug : LogLevel.Warn,
  },
  fetchPrefix: async (ctx: Message) => {
    if (!isGuildMessage(ctx)) return ENV.bot.prefix;
    else {
      let prefixFetch = container.client.GuildSettingsModel._cache.get(ctx.guild.id)?.prefix;
      if (prefixFetch) return prefixFetch;
      else {
        return ENV.bot.prefix;
      }
    }
  },
  //  regexPrefix: /^(hey +)?yoru[,! ]/i,
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "GUILD_BANS"],
  loadDefaultErrorListeners: true,
  loadMessageCommandListeners: true,
  partials: ["MESSAGE", "GUILD_MEMBER", "CHANNEL"],
  // Default global cool down settings.
  defaultCooldown: {
    // Ignored by Cooldown.
    filteredUsers: ENV.developer.discord_dev_ids,
  },
  disableMentionPrefix: false,
  i18n: parseInternationalizationOptions(),
  /**
   * Cache control for discord.js
   */
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: {
      maxSize: 100,
    }, // guild.commands
    BaseGuildEmojiManager: 0, // guild.emojis
    GuildBanManager: 0, // guild.bans
    GuildInviteManager: 0, // guild.invites
    GuildMemberManager: {
      maxSize: 1000,
      sweepInterval: hours(1),
      sweepFilter: Sweepers.filterByLifetime({
        lifetime: minutes(15),
      }),
    }, // guild.members
    GuildStickerManager: 0, // guild.stickers
    GuildScheduledEventManager: 0, // guild.scheduledEvents
    MessageManager: {
      sweepInterval: minutes(5),
      maxSize: 500,
      sweepFilter: Sweepers.filterByLifetime({
        lifetime: minutes(30),
        getComparisonTimestamp: (e) => e.editedTimestamp ?? e.createdTimestamp,
      }),
    }, // channel.messages
    PresenceManager: 0, // guild.presences
    ReactionManager: 0, // message.reactions
    ReactionUserManager: 0, // reaction.users
    StageInstanceManager: 0, // guild.stageInstances
    ThreadManager: 0,
    //  {
    //      sweepInterval: hours(1),
    //      maxSize: 100,
    //      sweepFilter: Sweepers.filterByLifetime({
    //          getComparisonTimestamp: e => e.archiveTimestamp ?? e.createdTimestamp,
    //          excludeFromSweep: e => !e.archived,
    //        }),
    //  }
    ThreadMemberManager: {
      sweepInterval: hours(1),
      maxSize: 100,
    }, // threadchannel.members
    UserManager: {
      sweepInterval: hours(6),
      maxSize: 50,
    }, // client.users
    VoiceStateManager: 0, // guild.voiceStates
  }),
  restGlobalRateLimit: 45,
  retryLimit: 5,
  restSweepInterval: minutes(5),
  restRequestTimeout: minutes(15),
  restTimeOffset: 500,
  restWsBridgeTimeout: seconds(5),
  // https://statcord.com/profile
  statcord: {
    client_id: "946398697254703174",
    key: "statcord.com-nZGoutFIlz4nnVA5XmWm", // (Required) Statcord API key.
    autopost: false, // (Optional) Allows automatic posting of statistics.
    debug: ENV.bot.dev ? true : false, // (Optional) Show debug messages.
    sharding: false, // (Optional) Activate the sharding mode, it is important to read the notes below.
  },
  // Hot Module Replacement
  // @see https://github.com/sapphiredev/plugins/tree/main/packages/hmr
  hmr: {
    enabled: ENV.bot.dev ? true : false,
  },
};
