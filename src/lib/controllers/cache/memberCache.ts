import { container } from "@sapphire/framework";
import { Guild } from "discord.js";
import { minutes } from "../../utils/time";
import { BaseCache } from "./cache";

interface MemberData {
  joined: number;
  left: number;
  lastJoin: Date;
}

export class IMemberCache extends BaseCache {
  /** The map of the cache */
  private pool: Map<string, MemberData>;

  public constructor() {
    super("member");
    this.pool = new Map();
    this.activeCacheManagers.push("member");

    setInterval(async () => {
      for (const guilds of container.client.guilds.cache.values()) {
        // Adds the guild member count to the queue...
        await this.next(guilds).then(() => {
          container.logger.info(`[MemberCache] Processed ${guilds.id} in member cache queue.`);
        });
      }
    }, minutes(25));
  }
  /**
   * Saves a member to the cache and increments the count data
   * @param key The guild id
   * @param value member count
   */
  public save(guild: Guild, value: number) {
    const data = this.get(guild);

    if (!data) {
      this.pool.set(guild.id, {
        joined: value,
        left: value,
        lastJoin: new Date(),
      });
    } else {
      data.joined += value;
      data.left += value;
      data.lastJoin = new Date();
    }
  }

  /**
   * Gets the current value of the cache
   * @param key The key of the member cache
   * @returns
   */
  private get(guild: Guild): MemberData | undefined {
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

    container.logger.info(`[MemberCache] Uploaded ${count ?? "nothing"} ${count ? "members" : ""} from ${guild.name} to the database.`);

    if (!count) return;

    const save = await container.client.GuildSettingsModel._model
      .findByIdAndUpdate(
        { _id: guild.id },
        {
          $set: {
            guild_name: guild.name,
            data: {
              member: {
                guildJoins: count,
                guildLeaves: count,
                lastJoin: new Date(),
              },
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
