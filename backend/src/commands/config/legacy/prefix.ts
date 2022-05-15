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

import { ApplyOptions } from "@sapphire/decorators";
import { Args, BucketScope } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
import { ICommandOptions, ICommand } from "../../../Command";
import { GuildsMongoModel } from "../../../database/models/guild";
import { seconds } from "../../../internal/functions/time";
import { BaseEmbed } from "../../../internal/structures/Embed";

@ApplyOptions<ICommandOptions>({
  name: "prefix",
  aliases: ["setprefix", "sprefix"],
  description: "Sets the prefix for the bot.",
  cooldownDelay: seconds(15),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "prefix <new prefix>",
    examples: ["prefix ??", "prefix reset"],
    command_type: "message",
  },
  requiredUserPermissions: ["MANAGE_GUILD"],
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    const { client } = this.container;
    const newPrefix = await args.pick("string").catch(() => null);

    if (!newPrefix) {
      let currentPrefix = client.LocalCacheStore.memory.guild.get(ctx.guild!)?.GuildPrefix;
      return ctx.reply({
        content: await this.translate(ctx.channel as TextChannel, "commands/config:prefix_command.missing_args"),
        embeds: [
          new BaseEmbed().contextEmbed(
            {
              description: await this.translate(
                ctx.channel as TextChannel,
                "commands/config:prefix_command.current_prefix",
                {
                  prefix: currentPrefix ?? client.environment.bot.bot_prefix,
                }
              ),
              fields: [
                {
                  name: "reset",
                  value: await this.translate(
                    ctx.channel as TextChannel,
                    "commands/config:prefix_command.reset_prefix_info",
                    {
                      prefix: currentPrefix ?? client.environment.bot.bot_prefix,
                    }
                  ),
                  inline: true,
                },
              ],
            },
            ctx
          ),
        ],
      });
    } else if (newPrefix === "reset") {
      // Removing the prefix from the cache and setting it to undefined
      let oldCache = client.LocalCacheStore.memory.guild.get(ctx.guild!);
      client.LocalCacheStore.memory.guild.set(ctx.guild!, {
        ...oldCache!,
        GuildPrefix: undefined,
      });
      await GuildsMongoModel.updateOne({ GuildId: ctx.guildId }, { $set: { GuildPrefix: null } });
      return await ctx.reply({
        content: await this.translate(ctx.channel as TextChannel, "commands/config:prefix_command.reset_success", {
          prefix: client.environment.bot.bot_prefix,
        }),
      });
    } else {
      const guild = await GuildsMongoModel.findOne({ GuildId: ctx.guildId });

      if (!guild) {
        await GuildsMongoModel.create({
          GuildId: ctx.guild!.id,
          GuildName: ctx.guild!.name,
          GuildOwnerId: ctx.guild!.ownerId,
          GuildPrefix: newPrefix,
        });
      }

      // Make sure the old values are not overwritten
      let oldCache = client.LocalCacheStore.memory.guild.get(ctx.guild!);
      client.LocalCacheStore.memory.guild.set(ctx.guild!, {
        ...oldCache,
        GuildPrefix: newPrefix,
        GuildId: ctx.guild!.id,
        CreatedAt: new Date(),
      });
      // Update the database
      await GuildsMongoModel.updateOne({ GuildId: ctx.guildId }, { $set: { GuildPrefix: newPrefix } }).then((res) =>
        client.logger.info(res)
      );

      return await ctx.reply({
        content: await this.translate(ctx.channel as TextChannel, "commands/config:prefix_command.new_prefix", {
          prefix: newPrefix,
        }),
        embeds: [],
      });
    }
  }
}
