import { container } from "@sapphire/framework";
import { Collection } from "discord.js";
import { hours } from "../../utils/time";

export const CommandCountCacheCollection = new Collection<string, number>();

export class StatisticsHandler {
  public client;

  public constructor(c: typeof container) {
    this.client = c;
  }
  public init(): void {
    setInterval(async () => {
      await this.statcordPost();
    }, hours(1));

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
