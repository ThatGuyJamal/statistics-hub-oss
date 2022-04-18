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
    name: string;
    full_name: string;
    dev: boolean;
    register_commands: boolean;
    prefix: string;
    token: string;
    client_id: string;
    CLIENT_SECRET: string;
    PUBLIC_KEY: string;
    test_guild_id: string;
    invite_url: string;
    server_link: string;
    redis: {
      host: string;
      port: number;
      password: string;
    };
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
