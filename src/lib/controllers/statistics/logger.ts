import { container } from "@sapphire/framework";
import { Message, TextChannel, Guild } from "discord.js";
import { ENV } from "../../../config";
import { BaseEmbed } from "../../utils/embed";

/**
 * A Utility class for logging events to our discord logs channels.
 */
export class IEventLogger {
  private _logger = container.logger;
  private _logChannelID = {
    join_leave: ENV.logger.join_leave_channel,
    shards: ENV.logger.shard_channel,
    api: ENV.logger.api_channel,
    blacklisted: ENV.logger.black_list_channel,
    commands: ENV.logger.command_channel,
  };
  private _client = container.client;

  /**
   * Logs a message to the shard log channel.
   * @param ctx The context of the message.
   * @param level The level of the message.
   * @param message The message to log.
   */
  public async shardLog(ctx: Message, level: logLevel, message: string): Promise<void> {
    let channel = this._client.channels.cache.get(this._logChannelID.shards) as TextChannel;
    if (channel && channel.type === "GUILD_TEXT" && ctx.guild) {
      this._logger.info(`[SHARD] ${level} | ${message} was sent to ${channel.name}`);
      switch (level) {
        case logLevel.info:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `Shard ${ctx.guild.shard.id}`,
                description: message,
                color: "LIGHT_GREY",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        case logLevel.warn:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `Shard ${ctx.guild.shard.id}`,
                description: message,
                color: "YELLOW",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        case logLevel.error:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `Shard ${ctx.guild.shard.id}`,
                description: message,
                color: "RED",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        case logLevel.debug:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `Shard ${ctx.guild.shard.id}`,
                description: message,
                color: "DARK_BLUE",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        default:
          break;
      }
    }
  }

  /**
   * Logs a message to the command log channel.
   * @param ctx The context of the message.
   * @param level The level of the message.
   * @param message The message to log.
   */
  public async commandLog(ctx: Message, level: logLevel, message: string): Promise<void> {
    let channel = this._client.channels.cache.get(this._logChannelID.commands) as TextChannel;
    if (channel && channel.type === "GUILD_TEXT" && ctx.guild) {
      this._logger.info(`[COMMAND] ${level} | ${message} was sent to ${channel.name}`);
      switch (level) {
        case logLevel.info:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `Command Info Event`,
                description: message,
                color: "LIGHT_GREY",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        case logLevel.warn:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `Command Warn Event`,
                description: message,
                color: "YELLOW",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        case logLevel.error:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `Command Error Event`,
                description: message,
                color: "RED",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        case logLevel.debug:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `Command Debug Event`,
                description: message,
                color: "DARK_BLUE",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        default:
          break;
      }
    }
  }

  /**
   * Logs a blacklisted guild/user to the blacklist log channel.
   * @param ctx   The context of the message.
   * @param level The level of the message.
   * @param message The message to log.
   */
  public async blackListLogs(ctx: Message, level: blackListLevel, message: string): Promise<void> {
    let channel = this._client.channels.cache.get(this._logChannelID.blacklisted) as TextChannel;
    if (channel && channel.type === "GUILD_TEXT" && ctx.guild) {
      this._logger.info(`[BLACKLIST] ${level} | ${message} was sent to ${channel.name}`);
      switch (level) {
        case blackListLevel.guild:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `New Blacklisted Guild`,
                description: message,
                color: "DARK_RED",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        case blackListLevel.user:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `New Blacklisted User`,
                description: message,
                color: "RED",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        default:
          break;
      }
    }
  }

  /**
   * Logs a join or level log to the join log channel.
   * @param ctx The context of the message.
   * @param level The level of the message.
   * @param message The message to log.
   */
  public async joinLogs(guild: Guild, level: guildEventLevel, message: string) {
    let channel = this._client.channels.cache.get(this._logChannelID.join_leave) as TextChannel;
    if (channel) {
      this._logger.info(`[JOIN/LEAVE] emitted on level: ${level} | ${guild.name}`);
      switch (level) {
        case guildEventLevel.join:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `New Guild Join`,
                description: message,
                color: "GREEN",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        case guildEventLevel.leave:
          await channel.send({
            embeds: [
              new BaseEmbed({
                title: `New Guild Leave`,
                description: message,
                color: "RED",
                timestamp: new Date(),
              }),
            ],
          });
          break;
        default:
          break;
      }
    }
  }
}

export enum logLevel {
  info = "info", // LIGHT_GREY
  warn = "warn", // YELLOW
  error = "error", // DARK_RED
  debug = "debug", // DARK_BLUE
}

export enum guildEventLevel {
  join = "GUILD_CREATE",
  leave = "GUILD_DELETE",
}

export enum blackListLevel {
  user = "USER",
  guild = "GUILD",
}
