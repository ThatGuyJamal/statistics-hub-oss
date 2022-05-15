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

import { container, LogLevel } from "@sapphire/framework";
import { ClientOptions, Message, Options, Sweepers } from "discord.js";
import { canaryMode, environment } from "../config";
import { isGuildMessage } from "../internal/functions/guards";
import { hours, minutes, seconds } from "../internal/functions/time";
import { parseInternationalizationOptions } from "../internal/il8n";

export const CLIENT_OPTIONS: ClientOptions = {
  shards: "auto",
  shardCount: 1,
  caseInsensitiveCommands: false,
  caseInsensitivePrefixes: false,
  defaultPrefix: environment.bot.bot_prefix,
  logger: {
    level: canaryMode ? LogLevel.Debug : LogLevel.Debug,
  },
  fetchPrefix: async (ctx: Message) => {
    if (!isGuildMessage(ctx)) return environment.bot.bot_prefix;
    else {
      let findPrefix = container.client.LocalCacheStore.memory.guild.get(ctx.guild)?.GuildPrefix;
      if (!findPrefix) {
        return environment.bot.bot_prefix;
      } else {
        return findPrefix;
      }
    }
  },
  // regexPrefix: /^(hey +)?sho[,! ]/i,
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
  loadDefaultErrorListeners: true,
  loadMessageCommandListeners: true,
  partials: ["MESSAGE", "GUILD_MEMBER", "CHANNEL", "USER"],
  // Default global cool down settings.
  defaultCooldown: {
    // Ignored by Cooldown.
    filteredUsers: environment.bot.developerMetaData.discord_dev_ids,
  },
  disableMentionPrefix: false,
  i18n: parseInternationalizationOptions(),
  /**
   * Cache control for discord.js
   */
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: {
      maxSize: 500,
    }, // guild.commands
    BaseGuildEmojiManager: 10, // guild.emojis
    GuildBanManager: 100, // guild.bans
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
      maxSize: 100,
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
    client_id: environment.bot.client_id,
    key: environment.bot.statcord.key, // (Required) Statcord API key.
    autopost: environment.bot.statcord.autopost, // (Optional) Allows automatic posting of statistics.
    debug: canaryMode ? true : false, // (Optional) Show debug messages.
    sharding: environment.bot.statcord.sharding, // (Optional) Activate the sharding mode.
  },
  // Hot Module Replacement
  // @see https://github.com/sapphiredev/plugins/tree/main/packages/hmr
  hmr: {
    enabled: canaryMode ? true : false,
  },
};
