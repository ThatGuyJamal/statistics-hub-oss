/** Our environment typings for ts support. */
export interface env_types {
  /** Config options for our database client */
  database: {
    /** Enables our db connection */
    enabled: boolean;
    /** Our mongoose connection string */
    mongodb_url: string;
    dev: boolean;
  };
  /** Config Options for our bot client */
  bot: {
    /** The name of the bot */
    name: string;
    /** A longer name for the bot. if there is one... */
    full_name: string;
    /** If the bot is in development mode */
    dev: boolean;
    /** 
     * If slash commands should be registered on startup. 
     * Make sure your using slash commands in test mode before enabling this or else you may spam the global api.
     */
    register_commands: boolean;
    prefix: string;
    token: string;
    client_id: string;
    CLIENT_SECRET: string;
    PUBLIC_KEY: string;
    /** The guild to deploy our slash commands for testing. */
    test_guild_id: string;
    test_guild_id_2: string;
    /** The url used to invite the bot to your discord server. */
    invite_url: string;
    /** The link to your support server */
    server_link: string;
    /** Redis server config */
    redis: {
      host: string;
      port: number;
      password: string;
    };
    /** Statcord config */
    statcord: {
      key: string;
      autopost: boolean;
      baseUrl: string;
      debug: boolean;
      sharding: boolean;
    };
  };
  /** Personal options for the developer information */
  developer: {
    name: string;
    discord_id: string;
    /** An array of all the other developers... */
    discord_dev_ids: string[];
    /** Array of all the bot supporter ids */
    discord_support_ids: string[];
    /** Array of all the bot staff ids */
    discord_staff_ids: string[];
    youtube_link: string;
    dashboard_link: string;
    documentation_link: string;
    bug_report_form: string;
    github_link: string;
  };
  /** Quick config data for bot logging information such as channel ID's and more */
  logger: {
    command_channel: string;
    shard_channel: string;
    api_channel: string;
    join_leave_channel: string;
    black_list_channel: string;
    member_join_channel: string;
  };
}
