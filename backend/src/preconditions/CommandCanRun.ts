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
import { canaryMode, environment } from "../config";

export class UserPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction, command: ChatInputCommand) {
    // Make sure the precondition is run on a guild.
    if (!interaction.guild) return this.ok();

    // Checks if the user is trying to use the production bot or not.
    if (this.checkCanaryMode() && !container.client.BotDevelopers.has(interaction.user.id)) {
      return this.error({
        message: `Sorry but im in "canary" mode and only my developers can run this version of the bot.`,
      });
    }

    // Checks if we are in maintenance mode.
    if (this.checkGlobalDisabled() && !container.client.BotDevelopers.has(interaction.user.id)) {
      return this.error({
        message: `Sorry but the bot is currently under maintenance. Join our support server for more updates.`,
      });
    }

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
      return this.error({ message: `The "${command.name}" command is disabled on this server.` });
    }

    // Make sure the command is not disabled in a channel.
    if (disabledChannelCommand && disabledChannelCommand.includes(interaction.channel!.id)) {
      return this.error({ message: `Commands are disabled for this channel.` });
    }

    // return the success result.
    return this.ok();
  }

  public override async messageRun(ctx: Message, command: MessageCommand) {
    // Make sure the precondition is run on a guild.
    if (!ctx.guild) return this.ok();

    if (this.checkCanaryMode() && !container.client.BotDevelopers.has(ctx.author.id)) {
      return this.error({ message: `Sorry but im in \`canary\` mode and only developers can run my commands.` });
    }

    const cachedData = container.client.LocalCacheStore.memory.plugins.commands.get(ctx.guild);
    // Make sure the guild has commands.
    if (!cachedData) return this.ok();

    // Get the cached data of all the disabled commands and channels.
    const disabledCommand = cachedData.GuildDisabledCommands;
    const disabledChannelCommand = cachedData.GuildDisabledCommandChannels;

    // Make sure the command is not disabled.
    if (disabledCommand && disabledCommand.includes(command.name)) {
      return this.error({ message: `The command "${command.name}" is disabled on this server.` });
    }

    // Make sure the command is not disabled in a channel.
    if (disabledChannelCommand && disabledChannelCommand.includes(ctx.channel.id)) {
      return this.error({ message: `Commands are disabled for this channel.` });
    }

    return this.ok();
  }

  private checkCanaryMode(): boolean {
    return canaryMode;
  }

  private checkGlobalDisabled(): boolean {
    return environment.bot.bot_maintenance_mode;
  }
}
