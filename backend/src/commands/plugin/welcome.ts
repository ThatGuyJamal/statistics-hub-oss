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
  Events,
} from "@sapphire/framework";
import { GuildMember } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { WelcomePluginMongoModel } from "../../database/models/plugins/welcome/welcome";
import { channelMention, codeBlock } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";
import { BaseEmbed } from "../../internal/structures/Embed";

@ApplyOptions<ICommandOptions>({
  name: "welcome",
  description: "Configure the welcome plugin",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "welcome [command] <arguments | or non>",
    examples: ["welcome setup <welcome channel> <welcome message>"],
    command_type: "slash",
    subcommands: ["delete", "enable", "disable", "setup", "simulate"],
  },
})
export class UserCommand extends ICommand {
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const { client } = this.container;
    if (!interaction.guild) return;

    if (interaction.options.getSubcommand() === "setup") {
      const themeOptions = interaction.options.getString("theme-type", true);
      const welcomeChannel = interaction.options.getChannel("welcome-channel", true);
      const goodbyeChannel = interaction.options.getChannel("goodbye-channel", true);
      let welcomeMessage = interaction.options.getString("welcome-message", false);

      if (!welcomeMessage) welcomeMessage = "Welcome to the server, {{user.mention}}!";

      let goodbyeMessage = interaction.options.getString("goodbye-message", false);

      if (!goodbyeMessage) goodbyeMessage = "Goodbye, {{user.mention}}!";

      const document = await WelcomePluginMongoModel.findOne({ GuildId: interaction.guildId });

      // If no document found, we create a new one.
      if (!document) {
        await interaction.channel?.send({
          content: `It seams you dont have the welcome plugin enabled. Here are a few tips:`,
          embeds: [
            new BaseEmbed({}).interactionEmbed(
              {
                description: codeBlock(
                  "css",
                  `
              === Formatting ===
              You can use the shortcuts below to format your message and meta data within it.

              All command shortcuts are case-sensitive and need to be wrapped in "{{" and "}}" brackets.

              Example: "{{user.mention}}" will be replaced with the user's mention.

              === Available shortcuts ===
              [user.mention] - Mentions the user that triggered the command.
              [user.username] - Replaces with the user's username.
              [user.id] - Replaces with the user's ID.
              [user.tag] - Replaces with the user's tag.
              [server.memberCount] - Replaces with the server's member count.
              [server.name] - Replaces with the server's name.
              [server.id] - Replaces with the server's ID.

              `
                ),
              },
              interaction
            ),
          ],
        });

        let oldData = client.LocalCacheStore.memory.plugins.welcome.get(interaction.guild!);
        if (!oldData) {
          client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
            GuildId: interaction.guildId as string,
            GuildName: interaction.guild!.name,
            GuildOwnerId: interaction.guild!.ownerId,
            Enabled: true,
            CreatedAt: new Date(),
            GuildWelcomeTheme: themeOptions,
            GuildWelcomeChannelId: welcomeChannel?.id,
            GuildWelcomeMessage: welcomeMessage,
            GuildGoodbyeChannelId: goodbyeChannel?.id,
            GuildGoodbyeMessage: goodbyeMessage,
            GuildWelcomeEmbed: {},
          });
        }
        await WelcomePluginMongoModel.create({
          GuildId: interaction.guildId as string,
          GuildName: interaction.guild!.name,
          GuildOwnerId: interaction.guild!.ownerId,
          Enabled: true,
          CreatedAt: new Date(),
          GuildWelcomeTheme: themeOptions,
          GuildWelcomeChannelId: welcomeChannel?.id,
          GuildWelcomeMessage: welcomeMessage,
          GuildGoodbyeChannelId: goodbyeChannel?.id,
          GuildGoodbyeMessage: goodbyeMessage,
          GuildWelcomeEmbed: {},
        }).then((res) => client.logger.info(res));
      }
      // If a document is found, we update it.
      else {
        await WelcomePluginMongoModel.updateOne(
          { GuildId: interaction.guildId },
          {
            $set: {
              GuildName: interaction.guild?.name,
              GuildOwnerId: interaction.guild?.ownerId,
              Enabled: true,
              GuildWelcomeChannelId: welcomeChannel?.id,
              GuildGoodbyeChannelId: goodbyeChannel?.id,
              GuildWelcomeMessage: welcomeMessage,
              GuildGoodbyeMessage: goodbyeMessage,
              GuildWelcomeTheme: themeOptions,
            },
          }
        ).then((res) => client.logger.info(res));
      }
      await interaction.reply({
        content: "Welcome plugin setup complete!",
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "disable") {
      // When the command is disabled, we will clear up some cache. but it will not delete the document from the database.
      client.LocalCacheStore.memory.plugins.welcome.delete(interaction.guild!);
      await WelcomePluginMongoModel.findOneAndUpdate(
        { GuildId: interaction.guildId },
        {
          $set: {
            Enabled: false,
          },
        }
      ).then((res) => {
        if (!res)
          return interaction.reply({
            content: "Welcome plugin is already disabled!",
            ephemeral: true,
          });
        client.logger.info(res);
        return interaction.reply({
          content: "Welcome plugin disabled!",
          ephemeral: true,
        });
      });
    } else if (interaction.options.getSubcommand() === "enable") {
      await WelcomePluginMongoModel.findOneAndUpdate(
        { GuildId: interaction.guild.id },
        {
          $set: {
            Enabled: true,
          },
        }
      )
        .then((res) => {
          if (!res) {
            return interaction.reply({
              content: "Welcome plugin is not setup! Please use `welcome setup` to setup the plugin.",
              ephemeral: true,
            });
          }
          client.logger.info(res);
          client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
            GuildId: res!.GuildId,
            GuildName: res!.GuildName ?? undefined,
            GuildOwnerId: res!.GuildOwnerId ?? undefined,
            Enabled: true,
            CreatedAt: res!.CreatedAt ?? new Date(),
            GuildWelcomeChannelId: res!.GuildWelcomeChannelId ?? undefined,
            GuildGoodbyeChannelId: res!.GuildGoodbyeChannelId ?? undefined,
            GuildWelcomeMessage: res!.GuildWelcomeMessage ?? undefined,
            GuildGoodbyeMessage: res!.GuildGoodbyeMessage ?? undefined,
            GuildWelcomeTheme: res!.GuildWelcomeTheme ?? undefined,
          });
          return interaction.reply({
            content: "Welcome plugin enabled!",
            ephemeral: true,
          });
        })
        .catch((err) => client.logger.error(err));
    } else if (interaction.options.getSubcommand() === "delete") {
      client.LocalCacheStore.memory.plugins.welcome.delete(interaction.guild!);
      await WelcomePluginMongoModel.deleteOne({ GuildId: interaction.guildId }).then((res) => client.logger.info(res));
      await interaction.reply({
        content: "Welcome plugin deleted!",
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "simulate") {
      let checkIfData = client.LocalCacheStore.memory.plugins.welcome.get(interaction.guild!);

      if (!checkIfData || !checkIfData.Enabled) {
        return await interaction.reply("Welcome plugin is not enabled!");
      }

      await interaction.reply({
        embeds: [
          new BaseEmbed().interactionEmbed(
            {
              description: "Running welcome plugin simulation...",
            },
            interaction
          ),
        ],
        ephemeral: true,
      });

      this.container.client.emit(Events.GuildMemberAdd, interaction.member as GuildMember);
      this.container.client.emit(Events.GuildMemberRemove, interaction.member as GuildMember);

      await interaction.editReply({
        embeds: [
          new BaseEmbed().interactionEmbed(
            {
              description: `Simulation complete! You can find the result in ${channelMention(
                checkIfData.GuildWelcomeChannelId!
              )}`,
            },
            interaction
          ),
        ],
      });
    }
  }
  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addSubcommand((options) =>
            options
              /**
               * ! setup command data
               */
              .setName("setup")
              .setDescription("Setup the welcome system.")
              .addStringOption((options) =>
                options
                  .setName("theme-type")
                  .setDescription("The type of theme you wish to use for the welcome plugin.")
                  .setRequired(true)
                  .addChoices([
                    ["Card", "card"],
                    ["Text", "text"],
                    // ["Embed", "embed"],
                  ])
              )
              .addChannelOption((options) =>
                options.setName("welcome-channel").setDescription("The welcome channel.").setRequired(true)
              )
              .addChannelOption((options) =>
                options.setName("goodbye-channel").setDescription("The good-bye channel.").setRequired(true)
              )
              .addStringOption((options) =>
                options
                  .setName("welcome-message")
                  .setDescription("The message to send in the welcome.")
                  .setRequired(false)
              )
              .addStringOption((options) =>
                options
                  .setName("goodbye-message")
                  .setDescription("The message to send in the goodbye.")
                  .setRequired(false)
              )
          )
          .addSubcommand((options) => options.setName("simulate").setDescription("Simulate a member join and leave."))
          .addSubcommand((options) => options.setName("enable").setDescription("Enable the welcome system."))
          .addSubcommand((options) => options.setName("disable").setDescription("Disable the welcome system."))
          .addSubcommand((options) => options.setName("delete").setDescription("Delete the welcome system.")),
      {
        guildIds: getTestGuilds(),
        registerCommandIfMissing: environment.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["973652318224535633"],
      }
    );
  }
}
