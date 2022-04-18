import { container, SapphireClient } from "@sapphire/framework";
import { connection } from "mongoose";
import { CLIENT_OPTIONS, ENV } from "../../config";
import { IMessageCache } from "../controllers/cache/messageCache";
import { IntervalsController } from "../controllers/interval";
import { IEventLogger } from "../controllers/statistics/logger";
import { StatisticsHandler } from "../controllers/statistics/statistics";
import { initializeTypeGooseConnection } from "../database";
import { GuildModelHandler } from "../database/guild/handler";
import { loadImportantMembers } from "../utils/loaders";

class ExtendedClient extends SapphireClient {
  public constructor() {
    super(CLIENT_OPTIONS);

    this.GuildSettingsModel = new GuildModelHandler();
    // this.cluster = new ShardCluster.Client(this);
    this.IntervalsController = new IntervalsController(this);
    this.EventLogger = new IEventLogger();
    this.StatisticsHandler = new StatisticsHandler(container);
    this.MessageCache = new IMessageCache();
    this.BotDevelopers = new Set();
    this.BotSupporters = new Set();
    this.BotStaff = new Set();
    this.environment = ENV;

    this.loadUtilities();
  }

  /** Starts our bot and all our private methods. Then authenticates into the discord api. */
  public async startClient() {
    await this.startDatabase(ENV.database.enabled);
    await this.login(ENV.bot.token);
  }

  /** Kills the node process and all its components */
  public override async destroy() {
    this.logger.fatal("Bot Process has been killed.");
    await connection.close(); // kills the db connection before killing the bot instance.
    super.destroy();
    process.exit(0);
  }

  /**
   * Loads all database functions for our client
   * @param on if the method should be started (useful for development.)
   * @returns
   */
  private async startDatabase(on: boolean) {
    if (on) {
      await initializeTypeGooseConnection();
    } else {
      this.logger.warn("Database has been set to off in client startup method!");
    }
  }

  private loadUtilities(): void {
    loadImportantMembers();
  }
}

const BotClient = new ExtendedClient();

export { BotClient };
