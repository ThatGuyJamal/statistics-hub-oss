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
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand } from "@sapphire/framework";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { DefaultWelcomeEmbed } from "../../lib/database";
import { WelcomeDocumentModel } from "../../lib/database/guild/plugins/welcome/welcome.plugin";
import { seconds } from "../../lib/utils/time";
import { getTestGuilds } from "../../lib/utils/utils";

const schema = WelcomeDocumentModel;

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
  extendedDescription: {
    examples: ["setup <options>"],
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  // Slash Based Command
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    if (!interaction.guild) return;

    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    });

    if (interaction.options.getSubcommand() === "setup") {
      await interaction.deferReply({
        ephemeral: true,
      })

      const themeOptions = interaction.options.getString("theme-type", true);
      const welcomeChannel = interaction.options.getString("welcome-channel", true);
      const goodbyeChannel = interaction.options.getString("goodbye-channel", true);
      let welcomeMessage = interaction.options.getString("welcome-message", false);

      if (!welcomeMessage) welcomeMessage = "Welcome to the server, {{user}}!";

      let goodbyeMessage = interaction.options.getString("goodbye-message", false);

      if (!goodbyeMessage) goodbyeMessage = "Goodbye, {{user}}!";

      await schema.updateOne({ _id: interaction.guildId }, {
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
      }, {
        upsert: true,
      })

      await interaction.editReply("Welcome system has been setup. You can use the `welcome test` command to view it in action.");
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
                options.setName("goodbye-channel").setDescription("The good-bye channel.").setRequired(false)
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
          ),
      {
        guildIds: getTestGuilds(),
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: [],
      }
    );
  }
}
