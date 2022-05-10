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

import { SapphireClient } from "@sapphire/framework";
import { connection } from "mongoose";
import { loadImportantMembers } from "./internal/bot-ids";
import { CLIENT_OPTIONS } from "./config/bot-config";
import { environment } from "./config";
import { ConnectToMongoose } from "./database/connect";
import { IntervalController } from "./controllers/interval";
import { RedisController } from "./cache/redis";
import { StatCordHandler } from "./api/statcord";
import { LocalCacheStore } from "./cache/store";
import { IEventLogger } from "./internal/EventLogger";

class ExtendedClient extends SapphireClient {
  public constructor() {
    super(CLIENT_OPTIONS);

    this.environment = environment;

    this.LocalCacheStore = new LocalCacheStore();
    this.IntervalController = new IntervalController(this);
    this.EventLogger = new IEventLogger()
    this.RedisController = RedisController;
    this.StatCordHandler = new StatCordHandler();

    this.BotDevelopers = new Set();
    this.BotSupporters = new Set();
    this.BotStaff = new Set();

    this.loadUtilities();
  }

  /** Starts our bot and all our private methods. Then authenticates into the discord api. */
  public async startClient() {
    await this.startDatabase(environment.db.enabled).then(() => super.login(environment.bot.token));
  }

  /** Kills the node process and all its components */
  public async destroyClient() {
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
      await ConnectToMongoose(environment.db.mongo.url);
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
