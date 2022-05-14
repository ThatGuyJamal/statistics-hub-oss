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
import { BucketScope, Args } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { channelMention } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";

@ApplyOptions<ICommandOptions>({
  aliases: ["clear-messages", "prune", "prune-messages", "clear"],
  description: "Purge messages in a channel.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "purge [amount] (channel)",
    examples: ["purge 10 #off-topic", "purge 5"],
    command_type: "message",
  },
  requiredClientPermissions: ["MANAGE_MESSAGES"],
  requiredUserPermissions: ["MANAGE_MESSAGES"],
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    if (!ctx.guild) return;
    const numberArg = await args.pick("number").catch(() => null);
    const channelArg = await args.pick("channel").catch(() => null);

    const channel = ctx.channel as TextChannel;

    if (!numberArg) {
      return await ctx.channel.send({
        content: "Please provide a number of messages to purge.\n Usage: `purge [amount] (channel)`",
        allowedMentions: { users: [ctx.author.id], roles: [] },
      });
    }

    // Make sure the numberArg is greater than 1 and less than 99
    if (numberArg < 2 || numberArg > 99) {
      return await ctx.channel.send({
        content: "Please provide a number between 2 and 99.",
        allowedMentions: { users: [ctx.author.id], roles: [] },
      });
    }

    // This means the user didn't provide a channel to purge from.
    if (numberArg && !channelArg) {
      try {
        const fetchedMessages = await ctx.channel.messages.fetch({ limit: numberArg + 1 ?? 1 });
        await channel.bulkDelete(fetchedMessages);

        let finishedMessage = await ctx.channel.send({
          content: `Deleted \`${fetchedMessages.size}\` messages.`,
          allowedMentions: { users: [ctx.author.id], roles: [] },
        });

        return setTimeout(() => {
          finishedMessage.delete().catch(() => {});
        }, seconds(8));
      } catch (e) {
        this.container.logger.error(e);
        let finishedMessage = await ctx.channel.send({
          content:
            "An error occurred while purging messages. Please make sure the messages are not older than 2 weeks.",
          allowedMentions: { users: [ctx.author.id], roles: [] },
        });

        return setTimeout(() => {
          finishedMessage.delete().catch(() => {});
        }, seconds(8));
      }
    }

    if (!channelArg) {
      return await ctx.channel.send({
        content: "Please provide a channel to purge messages from.\n Usage: `purge [amount] (channel)`",
        allowedMentions: { users: [ctx.author.id], roles: [] },
      });
    }

    if (numberArg && channelArg) {
      const channel = ctx.guild.channels.cache.find((c) => c.id === channelArg.id) as TextChannel;

      if (!channel) {
        return await ctx.channel.send({
          content: "Please provide a valid channel.",
          allowedMentions: { users: [ctx.author.id], roles: [] },
        });
      }

      try {
        const fetchedMessages = await channel.messages.fetch({ limit: numberArg + 1 ?? 1 });
        await channel.bulkDelete(fetchedMessages);

        let finishedMessage = await ctx.channel.send({
          content: `Successfully purged \`${numberArg + 1}\` messages from ${channelMention(channel.id)}.`,
          allowedMentions: { users: [ctx.author.id], roles: [] },
        });

        return setTimeout(() => {
          finishedMessage.delete().catch(() => {});
        }, seconds(8));
      } catch (e) {
        return await ctx.channel.send({
          content:
            "An error occurred while purging messages. Please make sure the messages are not older than 2 weeks in the channel.",
          allowedMentions: { users: [ctx.author.id], roles: [] },
        });
      }
    }

    return await ctx.channel.send({
      content: "Please provide a number of messages to purge.\n Usage: `purge [amount] (channel)`",
      allowedMentions: { users: [ctx.author.id], roles: [] },
    });
  }
}
