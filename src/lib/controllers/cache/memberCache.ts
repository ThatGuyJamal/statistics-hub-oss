import { container } from "@sapphire/framework";
import { Guild } from "discord.js";
import { minutes } from "../../utils/time";
import { BaseCache } from "./cache";

interface MemberData {
  joined: number;
  left: number;
  lastJoin: Date | null;
  guildBans: number;
}

type MemberDataType = "guildJoins" | "guildLeaves" | "lastJoin" | "guildBans";

export class IMemberCache extends BaseCache {
  /** The map of the cache */
  private pool: Map<string, MemberData>;

  public constructor() {
    super("member");
    this.pool = new Map();
    this.activeCacheManagers.push("member");

    setInterval(async () => {
      for (const guilds of container.client.guilds.cache.values()) {
        // Adds the guild message count to the queue...
       const result =  await this.next(guilds)
       if(result) {
         container.logger.info(`[MemberCache] Upload Success for cache[member] in ${guilds.name} (${guilds.id})`)
       } else {
          container.logger.warn(`[MemberCache] Upload Failed for cache[member] in ${guilds.name} (${guilds.id})`)
       }
      }
    }, minutes(1));
  }
  /**
   * Saves a member to the cache and increments the count data
   * @param key The guild id
   * @param value member count
   */
  public save(guild: Guild, event: MemberDataType, value: any) {
    const data = this.get(guild);

    switch (event) {
      case "guildJoins":
        if (!data) {
          this.pool.set(guild.id, {
            joined: value,
            left: 0,
            lastJoin: null,
            guildBans: 0,
          });
        } else {
          data.joined += value;
          this.pool.set(guild.id, data);
        }
        break;
      case "guildLeaves":
        if (!data) {
          this.pool.set(guild.id, {
            joined: 0,
            left: value,
            lastJoin: null,
            guildBans: 0,
          });
        } else {
          data.left += value;
          this.pool.set(guild.id, data);
        }
        break;
      case "lastJoin":
        if (!data) {
          this.pool.set(guild.id, {
            joined: 0,
            left: 0,
            lastJoin: value,
            guildBans: 0,
          });
        } else {
          data.lastJoin = value;
          this.pool.set(guild.id, data);
        }
        break;
      case "guildBans":
        if (!data) {
          this.pool.set(guild.id, {
            joined: 0,
            left: 0,
            lastJoin: null,
            guildBans: value,
          });
        } else {
          data.guildBans += value;
          this.pool.set(guild.id, data);
        }
        break;
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

    if (!old?.data?.member) return false

    container.logger.info(`[MemberCache] Uploading ${guild.name} to the database.`);

    const save = await container.client.GuildSettingsModel._model
      .findOneAndUpdate(
        { _id: guild.id },
        {
          $set: {
            guild_name: guild.name,
            data: {
              member: {
                guildJoins: old?.data?.member?.guildJoins ?? 0 + count.joined,
                guildLeaves: old?.data?.member?.guildLeaves ?? 0 + count.left,
                lastJoin: count.lastJoin ?? new Date(),
                guildBans: old?.data?.member?.guildBans ?? 0 + count.guildBans,
              },
            },
          },
        },
        { new: true, upsert: true, runValidators: true }
      )
      .exec()
      .then(() => this.pool.delete(guild.id));

    return true;
  }

  /** Gets the size of the message cache */
  protected get size() {
    return this.pool.size;
  }
}
