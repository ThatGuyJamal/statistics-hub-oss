import { container } from "@sapphire/framework";
import { Guild } from "discord.js";
import { pauseThread } from "../../utils/promises";
import { minutes } from "../../utils/time";
import { BaseCache } from "./cache";

export class IMessageCache extends BaseCache {
  /** The map of the cache */
  public collection: Map<string, number>;

  public constructor() {
    super();
    this.collection = new Map();

    setInterval(async () => {
      for (const guilds of container.client.guilds.cache.values()) {
        const cachedData: number | undefined = this.collection.get(guilds.id);
        if (!cachedData) return container.logger.warn(`[Message Cache] ${guilds.id} is not cached.`);
        else {
          await container.client.GuildSettingsModel._model
            .findOneAndUpdate(
              { _id: guilds.id },
              {
                $set: {
                  guild_name: guilds.name,
                  data: {
                    messages: cachedData,
                  },
                },
              },
              {
                upsert: true,
                new: true,
              }
              // After running the query to the db, we need to clear the cache so we can upload new data...
            )
            .exec()
            .then(() => container.logger.info(`Saved message data for ${guilds.name} to the database.`))
            .then(() => this.collection.delete(guilds.id));
        }
      }
    }, minutes(2));
  }

  /**
   * Saves the data
   * @param guild The Guild Object.
   * @returns {Map<string, number>} A map of the new cache
   */
  public save(guild: Guild, value: number): Map<string, number> {
    const oldCache: number | undefined = this.collection.get(guild.id);
    let result: number;
    if (!oldCache) {
      result = value;
      container.logger.info(`[Message Cache] ${result} was saved to the cache.`);
      // If there is no cache already, we will save the new value into the cache
      return this.collection.set(guild.id, result);
    } else {
      result = value + oldCache;
      container.logger.info(`[Message Cache] ${result} was saved to the cache.`);
      // If there is old cache, we will add that result to the updated value and re-save them.
      return this.collection.set(guild.id, result);
    }
  }

  /** Returns the size of the cache. */
  public get size() {
    return this.collection.size;
  }
}
