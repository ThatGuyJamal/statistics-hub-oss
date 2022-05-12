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
import { ICommandOptions, ICommand } from "../../Command";
import { channelMention, memberMention } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";

@ApplyOptions<ICommandOptions>({
  name: "lockchannel",
  aliases: ["lockc", "lc"],
  description: "Locks a channels message send permission.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "lockchannel (channel)",
    examples: ["lockchannel #off-topic", "lockchannel"],
    command_type: "message",
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    if (!ctx.guild) return;
    let channelArg = (await args.pick("channel").catch(() => null)) as TextChannel | null;

    // If no channel is given, we will lock the channel the command is ran in.
    if (!channelArg) channelArg = ctx.channel as TextChannel;

    // lock the channel
    return await channelArg.permissionOverwrites
      .create(ctx.guild.roles.everyone, {
        SEND_MESSAGES: false,
      })
      .then((res) => {
        return ctx.channel.send({
          embeds: [
            {
              title: "Channel Locked :lock:",
              description: `${memberMention(ctx.author.id)} locked ${channelMention(res.id)}.`,
              color: "YELLOW",
            },
          ],
        });
      })
      .catch(() => {
        return ctx.reply({
          content: `Error locking channel. Make sure I have permissions and the channel is a text channel.`,
        });
      });
  }
}

@ApplyOptions<ICommandOptions>({
  name: "unlockchannel",
  aliases: ["unlockc", "ulc"],
  description: "Unlocks a channels message send permission.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "unlockchannel (channel)",
    examples: ["unlockchannel #off-topic", "unlockchannel"],
    command_type: "message",
  },
})
export class UserCommand2 extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    if (!ctx.guild) return;

    let channelArg = (await args.pick("channel").catch(() => null)) as TextChannel | null;

    // If no channel is given, we will lock the channel the command is ran in.
    if (!channelArg) channelArg = ctx.channel as TextChannel;

    // unlock the channel
    return await channelArg.permissionOverwrites
      .create(ctx.guild.roles.everyone, {
        SEND_MESSAGES: true,
      })
      .then((res) => {
        return ctx.channel.send({
          embeds: [
            {
              title: "Channel Unlocked :unlock:",
              description: `${memberMention(ctx.author.id)} unlocked ${channelMention(res.id)}.`,
              color: "YELLOW",
            },
          ],
        });
      })
      .catch(() => {
        return ctx.reply({
          content: `Error unlocking channel. Make sure I have permissions and the channel is a text channel.`,
        });
      });
  }
}
