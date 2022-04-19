import { container } from "@sapphire/framework";
import { Guild } from "discord.js";
import { GuildSchemaMemberType } from "../../database/guild/model";
import { minutes } from "../../utils/time";
import { BaseCache } from "./cache";

type MemberDataType = "guildJoins" | "guildLeaves" | "lastJoin" | "guildBans";

export class IMemberCache extends BaseCache {
  /** The map of the cache */
  public collection: Map<string, GuildSchemaMemberType>;

  public constructor() {
    super();
    this.collection = new Map();

    setInterval(async () => {
      for (const guilds of container.client.guilds.cache.values()) {
        const cachedData = this.collection.get(guilds.id);
        if (!cachedData) return container.logger.warn(`[MemberCache] ${guilds.name} is not cached.`);
        else {
          const o = await container.client.GuildSettingsModel._model.findById(guilds.id);

          await container.client.GuildSettingsModel._model
            .findOneAndUpdate(
              { _id: guilds.id },
              {
                $set: {
                  guild_name: guilds.name,
                  data: {
                    member: {
                      //@ts-ignore
                      guildJoins: cachedData.guildJoins ?? 0 + o?.data?.member?.guildJoins ?? 0,
                      //@ts-ignore
                      guildLeaves: cachedData.guildLeaves ?? 0 + o?.data?.member?.guildLeaves ?? 0,
                      lastJoin: cachedData.lastJoin ?? undefined ?? o?.data?.member?.lastJoin ?? undefined,
                      //@ts-ignore
                      guildBans: cachedData.guildBans ?? 0 + o?.data?.member?.guildBans ?? 0,
                    },
                  },
                },
              },
              { upsert: true, new: true }
              // After running the query to the db, we need to clear the cache so we can upload new data...
            )
            .exec()
            .then(() => container.logger.info(`Saved member data for ${guilds.name} to the database.`))
            .then(() => this.collection.delete(guilds.id));
        }
      }
    }, minutes(2));
  }

  /**
   * Saves the new member data to the cache for processing
   * @param guild The Guild Object
   * @param type The type of event we will update
   * @param value The value to add to the cache
   * @returns
   */
  public save(guild: Guild, type: MemberDataType, value: number) {
    const oldCache: GuildSchemaMemberType | undefined = this.collection.get(guild.id);
    switch (type) {
      case "guildJoins":
        if (!oldCache) {
          return this.collection.set(guild.id, {
            guildJoins: value,
          });
        } else {
          return this.collection.set(guild.id, {
            guildJoins: oldCache.guildJoins ?? 0 + value,
            guildLeaves: oldCache.guildLeaves ?? 0,
            guildBans: oldCache.guildBans ?? 0,
            lastJoin: new Date(),
          });
        }
      case "lastJoin":
        if (!oldCache) {
          return this.collection.set(guild.id, {
            guildLeaves: value,
          });
        } else {
          return this.collection.set(guild.id, {
            guildJoins: oldCache.guildJoins ?? 0,
            guildLeaves: oldCache.guildLeaves ?? 0 + value,
            guildBans: oldCache.guildBans ?? 0,
            lastJoin: oldCache.lastJoin ?? undefined,
          });
        }
      case "guildBans":
        if (!oldCache) {
          return this.collection.set(guild.id, {
            guildBans: value,
          });
        } else {
          return this.collection.set(guild.id, {
            guildJoins: oldCache.guildJoins ?? 0,
            guildLeaves: oldCache.guildLeaves ?? 0,
            guildBans: oldCache.guildBans ?? 0 + value,
            lastJoin: oldCache.lastJoin ?? undefined,
          });
        }
      case "lastJoin":
        if (!oldCache) {
          return this.collection.set(guild.id, {
            guildLeaves: value,
          });
        } else {
          return this.collection.set(guild.id, {
            guildJoins: oldCache.guildJoins ?? 0,
            guildLeaves: oldCache.guildLeaves ?? 0,
            guildBans: oldCache.guildBans ?? 0,
            lastJoin: new Date(),
          });
        }
      default:
        return undefined;
    }
  }

  /** Returns the size of the cache. */
  public get size() {
    return this.collection.size;
  }
}
