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

import { CommandInteraction, Message } from "discord.js";
import { ChatInputCommand, container, MessageCommand, Precondition } from "@sapphire/framework";

export class UserPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction, command: ChatInputCommand) {
    // Make sure the precondition is run on a guild.
    if (!interaction.guild) return this.ok();
    // Make sure the command is valid from the api.

    if (!command) return this.ok();

    const cachedData = container.client.LocalCacheStore.memory.plugins.commands.get(interaction.guild);
    // Make sure the guild has commands.
    if (!cachedData) return this.ok();

    // Get the cached data of all the disabled commands and channels.
    const disabledCommand = cachedData.GuildDisabledCommands;
    const disabledChannelCommand = cachedData.GuildDisabledCommandChannels;

    // Make sure the command is not disabled.
    if (disabledCommand && disabledCommand.includes(command.name)) {
      return this.error({ message: `The command ${command.name} is disabled on this server.` });
    }

    // Make sure the command is not disabled in a channel.
    if (disabledChannelCommand && disabledChannelCommand.includes(interaction.channel!.id)) {
      return this.error({ message: `The command ${interaction.command!.name} is disabled on this channel.` });
    }

    // return the success result.
    return this.ok();
  }

  public override async messageRun(ctx: Message, command: MessageCommand) {
    // Make sure the precondition is run on a guild.
    if (!ctx.guild) return this.ok();
    const cachedData = container.client.LocalCacheStore.memory.plugins.commands.get(ctx.guild);
    // Make sure the guild has commands.
    if (!cachedData) return this.ok();

    // Get the cached data of all the disabled commands and channels.
    const disabledCommand = cachedData.GuildDisabledCommands;
    const disabledChannelCommand = cachedData.GuildDisabledCommandChannels;

    // Make sure the command is not disabled.
    if (disabledCommand && disabledCommand.includes(command.name)) {
      return this.error({ message: `The command ${command.name} is disabled on this server.` });
    }

    // Make sure the command is not disabled in a channel.
    if (disabledChannelCommand && disabledChannelCommand.includes(ctx.channel.id)) {
      return this.error({ message: `The command ${command.name} is disabled on this channel.` });
    }

    return this.ok();
  }
}