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
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { DefaultWelcomeEmbed, DefaultWelcomeModelObject } from "../../lib/database";
import { WelcomePluginDocument } from "../../lib/database/guild/plugins/welcome/welcome.plugin";
import { channelMention } from "../../lib/utils/format";
import { seconds } from "../../lib/utils/time";
import { getTestGuilds } from "../../lib/utils/utils";

@ApplyOptions<ICommandOptions>({
  description: "Configure the welcome system.",
  requiredUserPermissions: ["MANAGE_CHANNELS"],
  requiredClientPermissions: ["MANAGE_CHANNELS"],
  cooldownDelay: seconds(20),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  preconditions: ["DevelopmentOnly"],
  extendedDescription: {
    examples: ["setup <options>"],
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  // Slash Based Command
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    if (!interaction.guild) return;

    const document = (await this.container.client.GuildSettingsModel.getDocument(
      interaction.guild!,
      "welcome"
    )) as WelcomePluginDocument;

    // If no document is found at all, we will make one before running the sub commands
    if (!document) {

      // saving the document to cache
      this.container.client.GuildSettingsModel._welcomeCache.set(interaction.guild!.id, {
        _id: interaction.guild!.id,
        guild_name: interaction.guild.name,
        enabled: false,
        welcome_channel: undefined,
        welcome_message: undefined,
        goodbye_channel: undefined,
        goodbye_message: undefined,
        theme: undefined,
      })

      // saving the document to database
      await this.container.client.GuildSettingsModel.WelcomeModel.create({
        _id: interaction.guild!.id,
        guild_name: interaction.guild.name,
      })
        .then((res) => {
          this.container.logger.info(res);
        })
        .catch((err) => {
          this.container.logger.error(err);
        });
    }

    const oldData = this.container.client.GuildSettingsModel._welcomeCache.get(interaction.guild!.id);

    if (interaction.options.getSubcommand() === "setup") {

      await interaction.deferReply({
        ephemeral: true,
      })

      const themeOptions = interaction.options.getString("theme-type", true);
      const welcomeChannel = interaction.options.getChannel("welcome-channel", true);
      const goodbyeChannel = interaction.options.getChannel("goodbye-channel", true);
      let welcomeMessage = interaction.options.getString("welcome-message", false);

      if (!welcomeMessage) welcomeMessage = "Welcome to the server, {{user}}!";

      let goodbyeMessage = interaction.options.getString("goodbye-message", false);

      if (!goodbyeMessage) goodbyeMessage = "Goodbye, {{user}}!";

      // Saves the config to cache
      this.container.client.GuildSettingsModel._welcomeCache.set(interaction.guild!.id, {
        ...oldData,
        enabled: true,
        welcome_channel: welcomeChannel?.id,
        goodbye_channel: goodbyeChannel?.id,
        welcome_message: welcomeMessage,
        goodbye_message: goodbyeMessage,
        theme: themeOptions,
        // If the theme is set to embed, we will add the default embed object
        welcome_embed: themeOptions === "embed" ? DefaultWelcomeEmbed : undefined,
      });

      await this.container.client.GuildSettingsModel.WelcomeModel.updateOne(
        { _id: interaction.guildId },
        {
          $set: {
            enabled: true,
            welcome_channel: welcomeChannel,
            goodbye_channel: goodbyeChannel,
            welcome_message: welcomeMessage,
            goodbye_message: goodbyeMessage,
            theme: themeOptions,
            // If the theme is set to embed, we will add the default embed object
            welcome_embed: themeOptions === "embed" ? DefaultWelcomeEmbed : null,
          },
        },
        {
          upsert: true,
          new: true,
        }
      )
        .then(async (res) => {
          this.container.logger.info(res);
        })
        .catch((err) => {
          this.container.logger.error(err);
        });

      return await interaction.editReply({
        content: "Welcome system has been setup. You can use the `welcome test` command to view it in action.",
      });

    } else if (interaction.options.getSubcommand() === "test") {
      if (!oldData) return await interaction.reply({ content: "No welcome plugin data to test...", ephemeral: true, },)
      else {

        await interaction.reply({
          content: `Running welcome plugin test...`,
          ephemeral: true,
        });

        this.container.client.emit(Events.GuildMemberAdd, (member: GuildMember) => {
          return member;
        })

        return await interaction.followUp({
          content: `Test complete! you can find the results in ${channelMention(oldData.welcome_channel!)}`,
          ephemeral: true,
        });
      }


    } else {
      return await interaction.editReply("Invalid subcommand for the welcome-plugin was used.");
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
                    ["Embed", "embed"],
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
          .addSubcommand((options) => options.setName("test").setDescription("Test the welcome system.")),
      {
        guildIds: getTestGuilds(),
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["972952564444328047"],
      }
    );
  }
}
