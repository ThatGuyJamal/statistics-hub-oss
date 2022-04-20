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

import { container, SapphireClient } from "@sapphire/framework";
import { connection } from "mongoose";
import { CLIENT_OPTIONS, ENV } from "../../config";
import { IMemberCache } from "../controllers/cache/memberCache";
import { IMessageCache } from "../controllers/cache/messageCache";
import { IntervalsController } from "../controllers/interval";
import { IEventLogger } from "../controllers/statistics/logger";
import { StatisticsHandler } from "../controllers/statistics/statcord";
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
    this.TemporaryCaches = {
      MessageCache: new IMessageCache(),
      MemberCache: new IMemberCache(),
    };
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
