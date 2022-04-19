import { container } from "@sapphire/framework";
import { Guild } from "discord.js";
import { minutes } from "../../utils/time";
import { BaseCache } from "./cache";

export class IMessageCache extends BaseCache {
  /** The map of the cache */
  private pool: Map<string, number>;

  public constructor() {
    super("message");
    this.pool = new Map();
    this.activeCacheManagers.push("message");

    setInterval(async () => {
      for (const guilds of container.client.guilds.cache.values()) {
        // Adds the guild message count to the queue...
       const result =  await this.next(guilds)
       if(result) {
         container.logger.info(`[MessageCache] Upload Success for cache[messages] in ${guilds.name} (${guilds.id})`)
       } else {
          container.logger.warn(`[MessageCache] Upload Failed for cache[messages] in ${guilds.name} (${guilds.id})`)
       }
      }
    }, minutes(1));
  }
  /**
   * Saves a message to the cache and increments the count data
   * @param key The guild id
   * @param value Message count
   */
  public save(guild: Guild, value: number) {
    let cachedCount = this.get(guild);
    if (cachedCount) {
      cachedCount += value;
      this.pool.set(guild.id, cachedCount);
      container.logger.info(`[MessageCache] Saved ${cachedCount} messages to ${guild.name} (${guild.id})`);
    } else {
      this.pool.set(guild.id, value);
      container.logger.info(`[MessageCache] Created new cache for ${guild.name} with ${value} messages tracked.`);
    }
  }

  /**
   * Gets the current value of the cache
   * @param key The key of the message
   * @returns
   */
  private get(guild: Guild): number | undefined {
    return this.pool.get(guild.id);
  }

  /**
   * Uploads the cache to our db instance and clears the cache
   * @param guild The guild to upload the cache to
   */
  protected async next(guild: Guild) {
    return await this.upload(guild)
  }

  /**
   * Uploads the cache to our db instance
   * @param guild The guild api object
   */
  protected async upload(guild: Guild) {
    const count = this.pool.get(guild.id);

    if (!count) return false

    const old = await container.client.GuildSettingsModel._model.findById(guild.id);

    if (!old?.data?.message) return false

    const totalCount: number = old.data.message + count;

    container.logger.info(`[MessageCache] Uploaded ${totalCount} ${totalCount} ${totalCount > 1 ? 'messages' : 'message'} from ${guild.name} to the database.`);

    const save = await container.client.GuildSettingsModel._model
      .findOneAndUpdate(
        { _id: guild.id },
        {
          $set: {
            guild_name: guild.name,
            data: {
              message: totalCount,
            },
          },
        },
        { new: true, upsert: true, runValidators: true }
      )
      .exec()
      .then(() => this.pool.delete(guild.id));

    return true
  }

  /** Gets the size of the message cache */
  protected get size() {
    return this.pool.size;
  }
}
