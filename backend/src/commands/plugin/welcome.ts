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
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand, Events } from "@sapphire/framework";
import { GuildMember } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { WelcomePluginMongoModel } from "../../database/models/plugins/welcome/welcome";
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
        let oldData = client.LocalCacheStore.memory.plugins.welcome.get(interaction.guild!);
        if (!oldData) {
          client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
            GuildId: interaction.guildId as string,
            GuildName: interaction.guild!.name,
            GuildOwnerId: interaction.guild!.ownerId,
            Enabled: true,
            CreatedAt: new Date(),
          });
        }
        await WelcomePluginMongoModel.create({
          GuildId: interaction.guildId,
          GuildName: interaction.guild?.name,
          GuildOwnerId: interaction.guild?.ownerId,
          Enabled: true,
          GuildWelcomeChannelId: welcomeChannel?.id,
          GuildGoodbyeChannelId: goodbyeChannel?.id,
          GuildWelcomeMessage: welcomeMessage,
          GuildGoodbyeMessage: goodbyeMessage,
          GuildWelcomeTheme: themeOptions,
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
      await interaction.reply("Welcome plugin setup complete!");
    } else if (interaction.options.getSubcommand() === "disable") {
      // When the command is disabled, we will clear up some cache. but it will not delete the document from the database.
      client.LocalCacheStore.memory.plugins.welcome.delete(interaction.guild!);
      await WelcomePluginMongoModel.updateOne(
        { GuildId: interaction.guildId },
        {
          $set: {
            Enabled: false,
          },
        }
      ).then((res) => client.logger.info(res));
      await interaction.reply("Welcome plugin disabled!");
    } else if (interaction.options.getSubcommand() === "enable") {
      await WelcomePluginMongoModel.findOneAndUpdate(
        { GuildId: interaction.guildId },
        {
          $set: {
            Enabled: true,
          },
        }
      ).then((res) => {
        let c = client.LocalCacheStore.memory.plugins.welcome.set(interaction.guild!, {
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
        client.logger.info(c);
        client.logger.info(res);
      }).catch((err) => client.logger.error(err));
      await interaction.reply("Welcome plugin enabled!");
    } else if (interaction.options.getSubcommand() === "delete") {
      client.LocalCacheStore.memory.plugins.welcome.delete(interaction.guild!);
      await WelcomePluginMongoModel.deleteOne({ GuildId: interaction.guildId }).then((res) => client.logger.info(res));
      await interaction.reply("Welcome plugin deleted!");
    } else if (interaction.options.getSubcommand() === "simulate") {
      await interaction.reply({
        embeds: [
          new BaseEmbed().interactionEmbed({
            description: "Running welcome plugin simulation...",
          }, interaction)
        ]
      })

      client.emit(Events.GuildMemberAdd, interaction.member as GuildMember)

      await interaction.editReply({
        embeds: [
          new BaseEmbed().interactionEmbed({
            description: "Simulation complete!",
          }, interaction)
        ]
      })
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
