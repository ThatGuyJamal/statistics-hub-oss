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
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand, Args } from "@sapphire/framework";
import { Message, Permissions } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";
import { Pagination } from "pagination.djs";
import { BaseEmbed } from "../../internal/structures/Embed";
import { codeBlock } from "@sapphire/utilities";
import { capitalizeFirstLetter } from "../../internal/functions/formatting";
import ms from "ms";

@ApplyOptions<ICommandOptions>({
  name: "help",
  description: "Shows information about the commands and how to use them.",
  aliases: ["h", "commands", "cmds"],
  cooldownDelay: seconds(35),
  cooldownScope: BucketScope.User,
  cooldownLimit: 1,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "help <command name>",
    examples: ["help ping", "help prefix"],
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, _args: Args) {
    return await this.buildMessagePaginatedCommandList(ctx).catch(() => {
      return ctx.reply("Something went wrong while trying to build the command list. Please try again later...");
    });
  }

  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    return await this.buildSlashPaginatedCommandList(interaction).catch(() => {
      return interaction.reply("Something went wrong while trying to build the command list. Please try again...");
    });
  }

  /**
   * Resolves a command by name.
   * @param providedCommand The command name to resolve.
   * @private
   */
  private async __resolveCommand(providedCommand: string): Promise<ICommand | undefined> {
    const command = this.container.stores.get("commands").get(providedCommand.toLowerCase()) as ICommand | undefined;

    return command === undefined ? undefined : command;
  }

  // todo - not use type any
  private buildSlashPaginatedCommandList(interaction: any) {
    const pagination = new Pagination(interaction, {
      ephemeral: true,
      limit: 5,
      idle: seconds(30),
    });

    pagination.setButtonAppearance({
      first: {
        label: "First",
        emoji: "⏮",
        style: "PRIMARY",
      },
      prev: {
        label: "Prev",
        emoji: "◀️",
        style: "SECONDARY",
      },
      next: {
        label: "Next",
        emoji: "▶️",
        style: "SUCCESS",
      },
      last: {
        label: "Last",
        emoji: "⏭",
        style: "DANGER",
      },
    });

    // Get all the commands from the cache.
    const internalCommandList = [...this.container.client.stores.get("commands").values()].filter(
      (c) => c.category !== "developer"
    ) as ICommand[];

    const embedToCreate: BaseEmbed[] = [];

    // Loop through all the commands, and each one will be added to the embed.
    for (const command of internalCommandList) {
      const commandName = command.name;
      const commandDescription = command.description;

      // If the command is disabled, don't add it to the list.
      if (!command.enabled) continue;

      let pageNumber = 0;

      embedToCreate.push(
        new BaseEmbed()
          .setTitle(`${capitalizeFirstLetter(commandName)} Command`)
          .setDescription(
            codeBlock(
              "css",
              `
[Category] = ${command.category ?? "None"}
[Aliases] = ${command.aliases.join(", ") ?? "None"}
[Description] = ${commandDescription ?? "None"}
[Extended Description] = ${command.options.detailedDescription ?? "None"}
[Usage] = ${command.extendedDescription?.usage ?? "None"}
[Command Type] = ${command.extendedDescription?.command_type ?? "None"}
[Hidden] = ${command.extendedDescription?.hidden ? "Yes" : "No"}
[NSFW] = ${command.options.nsfw ? "Yes" : "No"}
[quotes] = ${command.options.quotes?.join(", ") ?? "None"}
[Cooldown] = ${ms(command.options.cooldownDelay ?? 0) ?? "None"}
[Cooldown Scope] = ${command.options.cooldownScope ?? "None"}
[Cooldown Limit] = ${command.options.cooldownLimit ?? "None"}
[Cooldown Filtered users] = ${command.options.cooldownFilteredUsers?.join(", ") ?? "None"}
[Run In] = ${command.options.runIn ?? "None"}
[Enabled] = ${command.options.enabled ? "Yes" : "No"}
[User Permissions] = ${
                command.options.requiredUserPermissions
                  ? new Permissions(command.options.requiredUserPermissions).toArray().join(", ")
                  : "None"
              }
[Bot Permissions] = ${
                command.options.requiredClientPermissions
                  ? new Permissions(command.options.requiredClientPermissions).toArray().join(", ")
                  : "None"
              }
[Examples] = ${command.extendedDescription?.examples ?? "None"}
        `
            )
          )
          .setColor("RANDOM")
          .setTimestamp()
      );
    }

    // Add the embed to the pagination.
    pagination.setEmbeds(embedToCreate);

    // Send the pagination.
    return pagination.render();
  }

  private buildMessagePaginatedCommandList(ctx: Message) {
    const pagination = new Pagination(ctx, {
      limit: 5,
      idle: seconds(30),
    });

    pagination.setButtonAppearance({
      first: {
        label: "First",
        emoji: "⏮",
        style: "PRIMARY",
      },
      prev: {
        label: "Prev",
        emoji: "◀️",
        style: "SECONDARY",
      },
      next: {
        label: "Next",
        emoji: "▶️",
        style: "SUCCESS",
      },
      last: {
        label: "Last",
        emoji: "⏭",
        style: "DANGER",
      },
    });

    // Get all the commands from the cache.
    const internalCommandList = [...this.container.client.stores.get("commands").values()].filter(
      (c) => c.category !== "developer"
    ) as ICommand[];

    const embedToCreate: BaseEmbed[] = [];

    // Loop through all the commands, and each one will be added to the embed.
    for (const command of internalCommandList) {
      const commandName = command.name;
      const commandDescription = command.description;

      // If the command is disabled, don't add it to the list.
      if (!command.enabled) continue;

      let pageNumber = 0;

      embedToCreate.push(
        new BaseEmbed()
          .setTitle(`${capitalizeFirstLetter(commandName)} Command`)
          .setDescription(
            codeBlock(
              "css",
              `
[Category] = ${command.category ?? "None"}
[Aliases] = ${command.aliases.join(", ") ?? "None"}
[Description] = ${commandDescription ?? "None"}
[Extended Description] = ${command.options.detailedDescription ?? "None"}
[Usage] = ${command.extendedDescription?.usage ?? "None"}
[Command Type] = ${command.extendedDescription?.command_type ?? "None"}
[Hidden] = ${command.extendedDescription?.hidden ? "Yes" : "No"}
[NSFW] = ${command.options.nsfw ? "Yes" : "No"}
[quotes] = ${command.options.quotes?.join(", ") ?? "None"}
[Cooldown] = ${ms(command.options.cooldownDelay ?? 0) ?? "None"}
[Cooldown Scope] = ${command.options.cooldownScope ?? "None"}
[Cooldown Limit] = ${command.options.cooldownLimit ?? "None"}
[Cooldown Filtered users] = ${command.options.cooldownFilteredUsers?.join(", ") ?? "None"}
[Run In] = ${command.options.runIn ?? "None"}
[Enabled] = ${command.options.enabled ? "Yes" : "No"}
[User Permissions] = ${
                command.options.requiredUserPermissions
                  ? new Permissions(command.options.requiredUserPermissions).toArray().join(", ")
                  : "None"
              }
[Bot Permissions] = ${
                command.options.requiredClientPermissions
                  ? new Permissions(command.options.requiredClientPermissions).toArray().join(", ")
                  : "None"
              }
[Examples] = ${command.extendedDescription?.examples ?? "None"}
        `
            )
          )
          .setColor("RANDOM")
          .setTimestamp()
      );
    }

    // Add the embed to the pagination.
    pagination.setEmbeds(embedToCreate);

    // Send the pagination.
    return pagination.render();
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: getTestGuilds(),
      registerCommandIfMissing: environment.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: ["97360358034076473"],
    });
  }
}
