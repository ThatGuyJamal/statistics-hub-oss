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
        await this.next(guilds).then(() => {
          container.logger.info(`[MessageCache] Processed ${guilds.name} in message cache queue.`);
        });
      }
    }, minutes(25));
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
  protected async next(guild: Guild): Promise<void> {
    await this.upload(guild).catch((err) => {
      container.logger.error(err);
    });
  }

  /**
   * Uploads the cache to our db instance
   * @param guild The guild api object
   */
  protected async upload(guild: Guild) {
    const count = this.pool.get(guild.id);

    container.logger.info(`[MessageCache] Uploaded ${count ?? "nothing"} ${count ? "messages" : ""} from ${guild.name} to the database.`);

    if (!count) return;

    const old = await container.client.GuildSettingsModel._model.findById(guild.id);

    const save = await container.client.GuildSettingsModel._model
      .findByIdAndUpdate(
        { _id: guild.id },
        {
          $set: {
            guild_name: guild.name,
            data: {
              message: old?.data?.message ?? 0 + count,
            },
          },
        },
        { new: true, upsert: true }
      )
      .exec()
      .then(() => this.pool.delete(guild.id));

    return save;
  }

  /** Gets the size of the message cache */
  protected get size() {
    return this.pool.size;
  }
}
