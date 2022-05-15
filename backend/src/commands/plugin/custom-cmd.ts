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
import {
  CommandModelStructure,
  CommandPluginEnum,
  CommandPluginMongoModel,
  CustomCommandSchema,
} from "../../database/models/command";
import stripIndent, { channelMention, createHyperLink, memberMention, roleMention } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";
import { Pagination } from "pagination.djs"
import { BaseEmbed } from "../../internal/structures/Embed";
import { isGuildMessage } from "../../internal/functions/guards";

const validCommandList = [...container.stores.get("commands").values()].map((c) => c.name);

@ApplyOptions<ICommandOptions>({
  name: "customcommand",
  aliases: ["ccl", "cc"],
  description: "A simple way to create custom commands.",
  cooldownDelay: seconds(17),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "customcommand create <trigger> <response>",
    examples: ["customcommand create server {{server.name}}"],
    command_type: "both",
    subcommands: ["create", "delete", "list"],
  },
  requiredUserPermissions: ["MANAGE_GUILD"],
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message) {
    if (!ctx.guild) return;
    const { client } = container;

    if(!isGuildMessage) return;

    const cachedData = client.LocalCacheStore.memory.plugins.commands.get(ctx.guild);

    if (!cachedData) {
      return await ctx.channel.send({
        content: `No custom commands exist for this server.`,
      });
    }

    const customCommands = cachedData.GuildCustomCommands!.data || [];

    if (customCommands.length === 0) {
      return await ctx.channel.send({
        content: `No custom commands exist for this server.`,
      });
    }

    await ctx.channel.send({
      content: `:warning: Warning! This plugin can only be configured with slash commands.`,
    });

    let amount = 1;

    return await this.fetchCustomCommands(ctx, customCommands);
  }
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const { client } = this.container;

    if (!interaction.guild) return;

    if (interaction.options.getSubcommand() === "create") {
      const triggerArgument = interaction.options.getString("trigger", true);
      const responseArgument = interaction.options.getString("response", true);
      const allowedChannelArgument = interaction.options.getChannel("channel", false)
      const allowedUserArgument = interaction.options.getUser("user", false)
      const allowedRoleArgument = interaction.options.getRole("role", false);

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

      if (!document) {
        await this.createMissingDataStorages(interaction);
      }

      if (!oldData) {
        await this.createMissingCacheStorages(interaction);
      }

      // Check if the command limit has been reached
      const customCommands = document?.GuildCustomCommands!.data || [];

      // TODO - Check if the guild is premium before limiting...
      if (customCommands.length >= CommandPluginEnum.commandLimit) {
        return await interaction.editReply(
          `You have reached the max limit of ${CommandPluginEnum.commandLimit} custom commands for this server. Please delete a custom command to add a new one or upgrade server to premium. You can learn more in the ${createHyperLink("documentation", environment.bot.developerMetaData.documentation_link)}. Run \`customcommand view\` to see your current command list.`
        );
      }

      /**
       * The new and updated command object to push to the database array.
       */
      const newCommand = {
        trigger: triggerArgument,
        response: responseArgument,
        allowedChannel: allowedChannelArgument ? allowedChannelArgument.id : null,
        allowedUser: allowedUserArgument ? allowedUserArgument.id : null,
        allowedRole: allowedRoleArgument ? allowedRoleArgument.id : null,
      } as CustomCommandSchema;

      // Save the new command to the cache
      let newLimit = document?.GuildCustomCommands?.limit! || CommandPluginEnum.commandLimit;

      // We will use this to push the new command to the array of custom commands
      let customCommandData = document?.GuildCustomCommands?.data || [];

      // Check if the limit is reached
      if (newLimit === 0) {
        return await interaction.editReply({
          content: `You have reached the limit of **${CommandPluginEnum.commandLimit}** custom commands for this server. Please update to a premium account to remove the limit.`,
        });
      }

      // If the limit is not reached, we will push the new command to the array and decrement the limit by 1
      newLimit--;

      // Check if the command already exists
      if (customCommandData.find((command) => command.trigger === triggerArgument)) {
        return await interaction.editReply({
          content: `The command \`${triggerArgument}\` already exists. Please use a different trigger or update the existing command.`,
        });
      }

      // Add the new command to the cache
      customCommandData.push(newCommand);

      // save the new data to the cache
      client.LocalCacheStore.memory.plugins.commands.set(interaction.guild, {
        ...oldData,
        GuildId: interaction.guild.id,
        GuildName: interaction.guild.name,
        CreatedAt: new Date(),
        GuildCustomCommands: {
          data: customCommandData,
          limit: newLimit,
        },
      });

      // Save the new data to the database
      await CommandPluginMongoModel.updateOne(
        { GuildId: interaction.guild.id },
        {
          $set: {
            GuildCustomCommands: {
              data: customCommandData,
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
      const triggerArgument = interaction.options.getString("delete-trigger", false);
      const deleteAllArgument = interaction.options.getBoolean("delete-all", false);

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

      if (deleteAllArgument && triggerArgument) {
        return await interaction.editReply({
          content: "You cannot use the delete-all and delete-trigger flags at the same time.",
        });
      }

      if (deleteAllArgument) {
        // Delete all commands
        await CommandPluginMongoModel.updateOne(
          { GuildId: interaction.guild.id },
          {
            $set: {
              GuildCustomCommands: {
                data: [],
                limit: CommandPluginEnum.commandLimit,
              },
            },
          }
        );

        // Delete the cache
        client.LocalCacheStore.memory.plugins.commands.delete(interaction.guild);

        // Send the success message
        return await interaction.editReply({
          content: `Successfully deleted all custom commands.`,
        });
      }

      if (!triggerArgument) {
        return await interaction.editReply({
          content: `Please specify a custom command to delete or delete them all.`,
        });
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
      // const document = await CommandPluginMongoModel.findOne({ GuildId: interaction.guild.id });
      const cachedData = client.LocalCacheStore.memory.plugins.commands.get(interaction.guild);

      await interaction.deferReply({
        ephemeral: true,
      });

      if (!cachedData) {
        return await interaction.editReply({
          content: `No custom commands exist for this server.`,
        });
      }

      const customCommands = cachedData.GuildCustomCommands?.data || [];

      if (customCommands.length === 0) {
        return await interaction.editReply({
          content: `No custom commands exist for this server.`,
        });
      }

      const prefix =
        client.LocalCacheStore.memory.guild.get(interaction.guild)?.GuildPrefix ?? client.environment.bot.bot_prefix;

      let amount = 1

      return await this.fetchCustomCommands(interaction, customCommands);
    }

    return await interaction.editReply({
      content: `Invalid subcommand. Please use \`customcommand list\` to see the list of custom commands.`,
    });
  }

  private async fetchCustomCommands(ctx: any, commandData: CustomCommandSchema[] | undefined) {
    const pagination = new Pagination(ctx, {
      limit: 5,
      idle: seconds(30)
    })
    const prefix = this.container.client.LocalCacheStore.memory.guild.get(ctx.guild)?.GuildPrefix ?? this.container.client.environment.bot.bot_prefix;

    pagination.setButtonAppearance({
      first: {
        label: 'First',
        emoji: '⏮',
        style: 'PRIMARY',
      },
      prev: {
        label: 'Prev',
        emoji: '◀️',
        style: 'SECONDARY',
      },
      next: {
        label: 'Next',
        emoji: '▶️',
        style: 'SUCCESS',
      },
      last: {
        label: 'Last',
        emoji: '⏭',
        style: 'DANGER',
      },
    });

    const embeds: BaseEmbed[] = [];

    if (!commandData || !commandData) return null

    const customCommands = commandData

    for (let i = 0; i < customCommands.length; i++) {
      const embed = new BaseEmbed({
        footer: {
          text: `The prefix to run triggers is: ${prefix}`
        }
      });

      embed.setTitle(`#${i + 1} - ${customCommands[i].trigger} | Custom Command`);
      embed.setDescription(stripIndent(`
__**Legend**__
Trigger - Whats used to run the custom command.
Response - What the bot will say when the trigger is run.
Restricted Role - The role that is required to run the custom command.
Restricted Channel - The channel that is required to run the custom command.
Restricted User - The user that is required to run the custom command.
      `)).setColor("RANDOM").setTimestamp()
      embed.addFields([
        {
          name: "Trigger",
          value: `__${customCommands[i].trigger}__`,
          inline: false,
        },
        {
          name: "Response",
          value: `__${customCommands[i].response}__`,
          inline: false,
        },
        {
          name: "Restricted Role",
          value: customCommands[i].allowedRole ? roleMention(customCommands[i].allowedRole) : "None",
          inline: true,
        }, {
          name: "Restricted Channel",
          value: customCommands[i].allowedChannel ? channelMention(customCommands[i].allowedChannel) : "None",
          inline: true,
        }, {
          name: "Restricted User",
          value: customCommands[i].allowedUser ? memberMention(customCommands[i].allowedUser) : "None",
          inline: true,
        }
      ])

      embeds.push(embed);
    }

    pagination.setEmbeds(embeds);
    return await pagination.render();
  }

  /**
   * Creates new cached data if non is found for the guild
   * @param cache The cache data
   * @param interaction The interaction
   * @returns {void}
   */
  private async createMissingCacheStorages(interaction: CommandInteraction<CacheType>) {
    if (!interaction.guild) return;
    const { client } = this.container;
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
  /**
   * Creates new database data if non is found for the guild
   * @param document The document data
   * @param interaction The interaction
   * @returns {Promise<void>}
   */
  private async createMissingDataStorages(interaction: CommandInteraction<CacheType>) {
    if (!interaction.guild) return;
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
                // TODO Debug error with these not saving to db...
                .addRoleOption((builder) => builder.setName("role").setDescription("If set only this role can use this custom command").setRequired(false))
                .addChannelOption((builder) => builder.setName("channel").setDescription("If set this custom command can only be used in this channel.").setRequired(false))
                .addUserOption((builder) => builder.setName("user").setDescription("If set this custom command can only be used by this server.").setRequired(false))
          )
          .addSubcommand((options) => options.setName("list").setDescription("List all custom commands."))
          .addSubcommand((options) =>
            options
              .setName("delete")
              .setDescription("Delete a custom command.")
              .addStringOption((builder) =>
                builder.setName("delete-trigger").setDescription("The trigger to delete.").setRequired(false)
              ).addBooleanOption((builder) =>
                builder.setName("delete-all").setDescription("If set all custom commands will be deleted.").setRequired(false)
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
