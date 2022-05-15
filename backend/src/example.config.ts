/**
    Statistics Hub OSS - A data analytics discord bot.
    
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
 * If set to true the bot will use all development settings. It is required to set this to false for production.
 */
export const canaryMode = false;

/**
 * The Object used for the bot's configuration and settings.
 */
export const environment = {
  /**
   * If the environment is in production mode.
   */
  production: false,
  /**
   * The database settings.
   */
  db: {
    /**
     * If the database is enabled.
     */
    enabled: true,
    /**
     * Redis configuration.
     */
    redis: {
      /**
       * If the redis connection should be persistent.
       */
      enabled: false,
      host: "127.0.0.1",
      port: 6379,
      password: "",
      username: "",
    },
    /**
     * MongoDB configuration.
     */
    mongo: {
      production: false,
      /**
       * If mongodb should be enabled or not in the environment.
       */
      enabled: true,
      /**
       * The mongodb connection string.
       */
      url: canaryMode ? "" : "",
    },
  },
  /**
   * The bot settings.
   */
  bot: {
    enabled: true,
    production: false,
    bot_name: "",
    bot_full_name: "",
    bot_prefix: "!!",
    version: "1.0.0",
    /**
     * The bot default language.
     * @default "en-US"
     */
    bot_language: "",
    /**
     * The bot authentication token from discords api. This is required to run the bot.
     */
    token: canaryMode ? "" : "",
    client_id: "",
    /**
     * If slash commands should be updated on the api on startup.
     * It is recommended to set this to false after they are updated becasue we will get ratelimited for posting to the api a lot.
     */
    register_commands: false,
    /**
     * ! WARNING
     * This will push all commands to the global api and not development servers.
     * @default false
     */
    register_global_commands: false,
    /**
     * The guilds to register slash commands to for testing. If this is empty, all commands will be set to global.
     */
    test_guild_ids: canaryMode ? [] : [],
    /**
     * The bots invite url to new servers.
     */
    bot_oauth_url: canaryMode ? "" : "",
    support_server_url: "",
    /**
     * The link to the bot code repository, if there is one.
     */
    bot_github_url: "",
    /**
     * @see - https://docs.statcord.com/#/
     */
    statcord: {
      key: "",
      autopost: true,
      baseUrl: "https://api.statcord.com/v3/",
      debug: true,
      sharding: false,
    },
    /**
     * Config for the core bot developer.
     */
    developerMetaData: {
      name: "",
      discord_id: "",
      youtube_link: "",
      dashboard_link: "",
      documentation_link: "",
      /**
       * A google form link to submit bug reports from users.
       */
      bug_report_form: "",
      github_link: "",
      /**
       * The Id's of all the bot developers. These users will bypass most of the bot permission limiters.
       */
      discord_dev_ids: [],
      /**
       * The Id's of all the bot developers. These users will have access to support only commands and more.
       */
      discord_support_ids: [],
      /**
       * These users only affect the support server, but they will have access to moderation commands and bot config settings.
       */
      discord_staff_ids: [],
    },
    /**
     * Bot Event channel config.
     * These channels are used for logging things such as events, errors, and commands being used.
     */
    channels: {
      command_channel: "",
      shard_channel: "",
      api_channel: "",
      join_leave_channel: "",
      black_list_channel: "",
      member_logs_channel: "",
    },
  },
};
