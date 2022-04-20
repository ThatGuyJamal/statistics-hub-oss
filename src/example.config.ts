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

/**
 * This configuration file controls our development and production environment.
 *
 * When the dev field is set to true, many of our functions will output to the console.
 */
import { env_types } from "./types/env";
import { ClientOptions, Options, Sweepers } from "discord.js";
import { LogLevel } from "@sapphire/framework";
import { parseInternationalizationOptions } from "./lib/il8n/function";
import { hours, minutes } from "./lib/utils/time";

/**
 * Fill out this object with your environment variables.
 * Most of them are required for the bot to work.
 * You can find type definitions for each of them in the types folder at @env_types
 */
export const ENV: env_types = {
  database: {
    enabled: true,
    mongodb_url: "",
    dev: true,
  },
  bot: {
    name: "",
    full_name: "",
    dev: true,
    register_commands: true,
    prefix: "",
    token: "",
    client_id: "",
    CLIENT_SECRET: "",
    PUBLIC_KEY: "",
    test_guild_id: [],
    invite_url:
      "https://discord.com/api/oauth2/authorize?client_id=946398697254703174&permissions=415001496704&scope=bot%20applications.commands",
    server_link: "https://discord.com/invite/N79DZsm3m2",
    redis: {
      host: "",
      port: 4404,
      password: "",
    },
    statcord: {
      key: "",
      autopost: false,
      baseUrl: "",
      debug: true,
      sharding: false,
    },
  },
  developer: {
    name: "",
    discord_id: "",
    youtube_link: "https://www.youtube.com/channel/UCVOQobByo_2WISQf2037eXQ",
    dashboard_link: "",
    documentation_link: "",
    bug_report_form: "",
    github_link: "https://github.com/ThatGuyJamal/statistics-hub-oss",
    discord_dev_ids: [],
    discord_support_ids: [],
    discord_staff_ids: [],
  },
  logger: {
    command_channel: "",
    shard_channel: "",
    api_channel: "",
    join_leave_channel: "",
    black_list_channel: "",
    member_join_channel: "",
  },
};

/**
 * Your client options are the options that you pass to the discord.js client.
 * They are used to configure the client and the bot from discord.js.
 */
export const CLIENT_OPTIONS: ClientOptions = {
  shards: "auto",
  shardCount: 1,
  caseInsensitiveCommands: true,
  caseInsensitivePrefixes: true,
  defaultPrefix: ENV.bot.prefix,
  logger: {
    level: ENV.bot.dev ? LogLevel.Debug : LogLevel.Warn,
  },
  regexPrefix: /^(hey +)?yourbotname[,! ]/i,
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"],
  loadDefaultErrorListeners: true,
  loadMessageCommandListeners: true,
  partials: ["MESSAGE", "GUILD_MEMBER"],
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
    ThreadManager: {
      sweepInterval: hours(1),
      maxSize: 100,
      sweepFilter: Sweepers.filterByLifetime({
        getComparisonTimestamp: (e) => e.archiveTimestamp ?? e.createdTimestamp,
        excludeFromSweep: (e) => !e.archived,
      }),
    },
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
  // https://statcord.com/profile
  statcord: {
    client_id: "",
    key: ENV.bot.statcord.key, // (Required) Statcord API key.
    autopost: ENV.bot.statcord.autopost, // (Optional) Allows automatic posting of statistics.
    debug: ENV.bot.statcord.debug, // (Optional) Show debug messages.
    sharding: ENV.bot.statcord.sharding, // (Optional) Activate the sharding mode, it is important to read the notes below.
  },
  // Hot Module Replacement
  // @see https://github.com/sapphiredev/plugins/tree/main/packages/hmr
  hmr: {
    enabled: ENV.bot.dev ? true : false,
  },
};
