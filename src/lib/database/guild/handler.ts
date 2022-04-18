import { GuildDocument, GuildDocumentModel, GuildSchema, GuildSchemaMemberType } from "./model";
import { Collection, Guild } from "discord.js";
import { container } from "@sapphire/framework";

export class GuildModelHandler {
  /** Model types for mongoose query's... */
  public _model = GuildDocumentModel;
  /** The local cache for quick setting information */
  public _cache = new Collection<string, GuildDocument>();

  public async initCache() {
    // find all the documents in the db

    const guildsToCacheLimit = container.client.guilds.cache.size;

    if (guildsToCacheLimit < 100) {
      const documents = await this._model.find();

      if (documents) {
        // add them to the cache
        for (const doc of documents) this._cache.set(doc._id, doc);
        container.logger.info(
          `[GuildModelHandler] Loaded ${documents.length} guilds from the database into the cache.`
        );
      }
    }
  }

  /**
   * Handler allowing us to update a guild's settings.
   * @param guild The guild to update
   * @param options The option to update
   * @param value The value to update the option with
   * @returns
   */
  public async insertOne(
    guild: Guild,
    options: _OneOptions,
    value: string | number | boolean | GuildSchemaMemberType | GuildSchema
  ) {

    const doc = await this._model.findOneAndUpdate(
      { _id: guild.id },
      { $set: { [options]: value } },
      { upsert: true, new: true }
    );

    if (doc) {
      this._cache.set(guild.id, doc);
      switch (options) {
        case "message":
          return doc.data?.message ?? 0;
        case "language":
          return doc.language;
        case "blacklisted":
          return doc.blacklisted;
        case "member":
          return doc.data?.member ?? { guildJoins: 0, guildLeaves: 0, lastJoin: null };
        case "voice":
          return doc.data?.voice ?? 0;
        case "data":
          // the entire data object
          return doc.data;
        default:
          return doc;
      }
    } else {
      const newGuild = await this._model.create({
        _id: guild.id,
        GuildName: guild.name,
        [options]: value,
      });

      container.logger.info(`[GuildModelHandler] Inserted new guild ${guild.id} into the database.`);

      this._cache.set(guild.id, newGuild);

      return await newGuild
    }
  }

  public async deleteOne(guild: Guild, options: _OneOptions) {
    const cached = this._cache.get(guild.id);

    if (cached) {
      if (cached.hasOwnProperty(options)) {
        switch (options) {
          case "message":
            delete cached.data?.message
            break;
          case "language":
            delete cached.language
            break;
          case "blacklisted":
            delete cached.blacklisted
            break;
          case "member":
            delete cached.data?.member
            break;
          case "voice":
            delete cached.data?.voice
            break;
          case "data":
            delete cached.data
            break;
        }
      } 
    }

    return this._model.find ({ _id: guild.id, [options]: { $exists: true } });
  }

  /**
   * Get a guild from the database
   * @param guild The guild to get the settings for
   * @returns The guild settings for the given guild id
   */
  public async getDocument(guild: Guild) {
    if (this._cache.has(guild.id)) return this._cache.get(guild.id);
    const doc = await this._model.findById(guild.id);
    if (doc) this._cache.set(guild.id, doc);
    return doc;
  }

  /**
   * Deletes a guild configuration from the database.
   * @param id Guild ID
   */
  public async wipe(id: string) {
    this._cache.delete(id);
    return this._model.findByIdAndDelete(id);
  }
}

/** Typings for our query helper */
enum _OneOptions {
  message = "message",
  language = "language",
  blacklisted = "blacklisted",
  member = "member",
  voice = "voice",
  data = "data",
}
