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
import {
  BucketScope,
  ApplicationCommandRegistry,
  RegisterBehavior,
  ChatInputCommand,
  container,
} from "@sapphire/framework";
import { codeBlock } from "@sapphire/utilities";
import { CacheType, CommandInteraction, Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { CommandPluginEnum, CommandPluginMongoModel, CustomCommandSchema } from "../../database/models/command";
import { channelMention, memberMention, roleMention } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";

const validCommandList = [...container.stores.get("commands").values()].map((c) => c.name);

@ApplyOptions<ICommandOptions>({
  name: "customcommand",
  aliases: ["ccl"],
  description: "A simple way to create custom commands.",
  cooldownDelay: seconds(15),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "customcommand create <trigger> <response>",
    examples: ["customcommand create server {{server.name}}"],
    command_type: "both",
  },
  requiredUserPermissions: ["MANAGE_GUILD"],
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message) {
    if (!ctx.guild) return;
    const { client } = container;

    const document = await CommandPluginMongoModel.findOne({ GuildId: ctx.guild.id });
    const prefix =
      client.LocalCacheStore.memory.guild.get(ctx.guild)?.GuildPrefix ?? client.environment.bot.bot_prefix;

    if (!document) {
      return await ctx.channel.send({
        content: `No custom commands exist for this server.`,
      });
    }

    const customCommands = document.GuildCustomCommands!.data || [];

    if (customCommands.length === 0) {
      return await ctx.channel.send({
        content: `No custom commands exist for this server.`,
      });
    }

    await ctx.channel.send({
      content: `:warning: Warning! This plugin can only be configured with slash commands.`,
    });
    return await ctx.channel.send({
      content: codeBlock(
        "css",
        `
=== Custom Commands ===
${customCommands
  .map(
    (command) =>
      `[${command.trigger}] = Allowed Channels: ${command.allowedChannels
        ?.map((chan) => channelMention(chan) ?? "All")
        .join(", ")} | Allowed Users: ${
        command.allowedUsers?.map((user) => memberMention(user)).join(", ") ?? "All"
      } | Allows Roles ${command.allowedRoles?.map((role) => roleMention(role) ?? "All").join(", ")}`
  )
  .join("\n\n")}

Tip: To run a custom command you must use the bots prefix. Example: ${prefix}mycustomcommand.
`
      ),
    });
  }
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const { client } = this.container;

    if (!interaction.guild) return;

    if (interaction.options.getSubcommand() === "create") {
      const triggerArgument = interaction.options.getString("trigger", true);
      const responseArgument = interaction.options.getString("response", true);

      await interaction.deferReply({
        ephemeral: true,
      });

      // Make sure lenth of trigger is at least 2 characters and under 20 characters
      if (triggerArgument.length < 2 || triggerArgument.length > 20) {
        return await interaction.editReply("Custom Command Trigger must be between 2 and 20 characters.");
      }

      // Make sure lenth of response is at least 1 character and under 500 characters
      if (responseArgument.length < 1 || responseArgument.length > 500) {
        return await interaction.editReply("Custom Command Response must be between 1 and 500 characters.");
      }

      // make sure the custom command is not a built in command
      if (validCommandList.includes(triggerArgument)) {
        return await interaction.editReply(
          "Custom Command Trigger cannot be a built in command. Please choose a different trigger."
        );
      }

      const oldData = client.LocalCacheStore.memory.plugins.commands.get(interaction.guild);
      const document = await CommandPluginMongoModel.findOne({ GuildId: interaction.guild.id });

      const triggerCommandData = {
        trigger: triggerArgument,
        response: responseArgument,
      } as CustomCommandSchema;

      if (!document) {
        await this.createMissingDataStorages(interaction);
      }

      if (!oldData) {
        await this.createMissingCacheStorages(interaction);
      }

      // Save the new command to the cache
      let newLimit = document?.GuildCustomCommands?.limit! - 1 || CommandPluginEnum.commandLimit - 1;
      let newData = document?.GuildCustomCommands?.data || [];

      // Check if the limit is reached
      if (newLimit === 0) {
        return await interaction.editReply({
          content: `You have reached the limit of ${CommandPluginEnum.commandLimit} custom commands. Please update to a premium account to remove the limit.`,
        });
      }

      // Check if the command already exists
      if (newData.find((command) => command.trigger === triggerArgument)) {
        return await interaction.editReply({
          content: `The command ${triggerArgument} already exists. Please use a different trigger or update the existing command.`,
        });
      }

      // Add the new command to the cache
      newData.push(triggerCommandData);

      // save the new data to the cache
      client.LocalCacheStore.memory.plugins.commands.set(interaction.guild, {
        ...oldData,
        GuildId: interaction.guild.id,
        GuildName: interaction.guild.name,
        CreatedAt: new Date(),
        GuildCustomCommands: {
          data: newData,
          limit: newLimit,
        },
      });

      // Save the new data to the database
      await CommandPluginMongoModel.updateOne(
        { GuildId: interaction.guild.id },
        {
          $set: {
            GuildCustomCommands: {
              data: newData,
              limit: newLimit,
            },
          },
        }
      );

      // Send the success message
      return await interaction.editReply({
        content: `Successfully created custom command \`${triggerArgument}\``,
      });
    } else if (interaction.options.getSubcommand() === "delete") {
      const triggerArgument = interaction.options.getString("delete-trigger", true);

      await interaction.deferReply({
        ephemeral: true,
      });

      const oldData = client.LocalCacheStore.memory.plugins.commands.get(interaction.guild);
      const document = await CommandPluginMongoModel.findOne({ GuildId: interaction.guild.id });

      if (!document) {
        await this.createMissingDataStorages(interaction);
      }

      if (!oldData) {
        await this.createMissingCacheStorages(interaction);
      }

      // Make sure the command exists in the database
      if (
        !document?.GuildCustomCommands?.data.find((command: { trigger: string }) => command.trigger === triggerArgument)
      ) {
        return await interaction.editReply({
          content: `The command \`${triggerArgument}\` does not exist. Please run \`customcommand list\` to see the list of custom commands.`,
        });
      }

      // Remove the command from the cache
      client.LocalCacheStore.memory.plugins.commands.set(interaction.guild, {
        ...oldData,
        GuildId: interaction.guild.id,
        GuildName: interaction.guild.name,
        CreatedAt: new Date(),
        GuildCustomCommands: {
          data: document.GuildCustomCommands.data.filter(
            (command: { trigger: string }) => command.trigger !== triggerArgument
          ),
          limit: document.GuildCustomCommands.limit < 5 ? document.GuildCustomCommands.limit + 1 : 5,
        },
      });

      // Save the new data to the database
      await CommandPluginMongoModel.updateOne(
        { GuildId: interaction.guild.id },
        {
          $set: {
            GuildCustomCommands: {
              data: document.GuildCustomCommands.data.filter(
                (command: { trigger: string }) => command.trigger !== triggerArgument
              ),
              limit: document.GuildCustomCommands.limit < 5 ? document.GuildCustomCommands.limit + 1 : 5,
            },
          },
        }
      );

      // Send the success message
      return await interaction.editReply({
        content: `Successfully deleted custom command \`${triggerArgument}\``,
      });
    } else if (interaction.options.getSubcommand() === "list") {
      const document = await CommandPluginMongoModel.findOne({ GuildId: interaction.guild.id });
      const prefix =
        client.LocalCacheStore.memory.guild.get(interaction.guild)?.GuildPrefix ?? client.environment.bot.bot_prefix;

      await interaction.deferReply({
        ephemeral: true,
      });

      if (!document) {
        return await interaction.editReply({
          content: `No custom commands exist for this server.`,
        });
      }

      const customCommands = document.GuildCustomCommands!.data || [];

      if (customCommands.length === 0) {
        return await interaction.editReply({
          content: `No custom commands exist for this server.`,
        });
      }

      return await interaction.editReply({
        content: codeBlock(
          "css",
          `
=== Custom Commands ===
${customCommands
  .map(
    (command) =>
      `[${command.trigger}] = Allowed Channels: ${command.allowedChannels
        ?.map((chan) => channelMention(chan) ?? "All")
        .join(", ")} | Allowed Users: ${
        command.allowedUsers?.map((user) => memberMention(user)).join(", ") ?? "All"
      } | Allows Roles ${command.allowedRoles?.map((role) => roleMention(role) ?? "All").join(", ")}`
  )
  .join("\n\n")}

Tip: To run a custom command you must use the bots prefix. Example: ${prefix}mycustomcommand
`
        ),
      });
    }

    return await interaction.editReply({
      content: `Invalid subcommand. Please use \`customcommand list\` to see the list of custom commands.`,
    });
  }

  private async createMissingCacheStorages(interaction: CommandInteraction<CacheType>) {
    if (!interaction.guild) return;
    const { client } = this.container;
    const oldData = client.LocalCacheStore.memory.plugins.commands.get(interaction.guild);
    if (!oldData) {
      client.LocalCacheStore.memory.plugins.commands.set(interaction.guild, {
        GuildId: interaction.guild.id,
        GuildName: interaction.guild.name,
        GuildOwnerId: interaction.guild.ownerId,
        GuildDisabledCommands: [],
        GuildDisabledCommandChannels: [],
        GuildCustomCommands: {
          data: [],
          limit: 5,
        },
        CreatedAt: new Date(),
      });
    }
  }
  private async createMissingDataStorages(interaction: CommandInteraction<CacheType>) {
    if (!interaction.guild) return;
    const document = await CommandPluginMongoModel.findOne({ GuildId: interaction.guild.id });
    if (!document) {
      await CommandPluginMongoModel.create({
        GuildId: interaction.guild.id,
        GuildName: interaction.guild.name,
        GuildOwnerId: interaction.guild.ownerId,
        GuildDisabledCommands: [],
        GuildDisabledCommandChannels: [],
        GuildCustomCommands: {
          data: [],
          limit: 5,
        },
        CreatedAt: new Date(),
      });
    }
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addSubcommand(
            (options) =>
              options
                .setName("create")
                .setDescription("Create a custom command.")
                .addStringOption((builder) =>
                  builder.setName("trigger").setDescription("The trigger for the command.").setRequired(true)
                )
                .addStringOption((builder) =>
                  builder.setName("response").setDescription("The response for the command.").setRequired(true)
                )
            // TODO - implement custom command limiters
            // .addRoleOption((builder) => builder.setName("role").setDescription("The role that can use the command.").setRequired(false))
            // .addChannelOption((builder) => builder.setName("channel").setDescription("The channel that can use the command.").setRequired(false))
            // .addUserOption((builder) => builder.setName("user").setDescription("The user that can use the command.").setRequired(false))
          )
          .addSubcommand((options) => options.setName("list").setDescription("List all custom commands."))
          .addSubcommand((options) =>
            options
              .setName("delete")
              .setDescription("Delete a custom command.")
              .addStringOption((builder) =>
                builder.setName("delete-trigger").setDescription("The trigger to delete.").setRequired(true)
              )
          ),
      {
        guildIds: getTestGuilds(),
        registerCommandIfMissing: environment.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: [],
      }
    );
  }
}
