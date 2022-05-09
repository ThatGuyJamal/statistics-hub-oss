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

import { container } from "@sapphire/framework";
import { Collection } from "discord.js";
import { hours } from "../internal/functions/time";

export const CommandCountCacheCollection = new Collection<string, number>();

export class StatCordHandler {
  public client = container;

  public init(): void {
    container.client.IntervalController.start(
      "statcord-post-interval",
      async () => {
        await this.statcordPost();
      },
      hours(1)
    );

    this.client.statcord.on("autopost-start", () => {
      // Emitted when statcord autopost starts
      container.logger.info("Statcord autopost started!");
    });

    this.client.statcord.on("post", (status) => {
      // status = false if the post was successful
      // status = "Error message" or status = Error if there was an error
      if (!status) this.client.logger.info("Successful post");
      else this.client.logger.error(status);
    });
  }

  /** Post the current collected stats to the api */
  public async statcordPost() {
    try {
      return await this.client.statcord.postStats();
    } catch (err) {
      this.client.logger.error(err);
      return null;
    }
  }

  /** Gets the current stats from the api */
  public async statcordGet() {
    try {
      return await this.client.statcord.clientStats();
    } catch (err) {
      this.client.logger.error(err);
      return null;
    }
  }

  /**
   * Gets the current votes from the api
   * @param id The user id to get the votes for
   * @returns The votes for the user or null
   */
  public async statcordGetVotes(id: string) {
    try {
      return await this.client.statcord.userVotesStats(id);
    } catch (err) {
      this.client.logger.error(err);
      return null;
    }
  }

  /**
   * Gets the total daily votes from the api
   * @returns The total votes
   */
  public async statcordGetDailyVotes() {
    try {
      return await this.client.statcord.bucketStats();
    } catch (err) {
      this.client.logger.error(err);
      return null;
    }
  }
}
