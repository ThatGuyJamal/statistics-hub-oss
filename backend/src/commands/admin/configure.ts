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
import { Guild, TextChannel } from "discord.js";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { GuildDocument } from "../../lib/database/guild/guild.model";
import { codeBlock } from "../../lib/utils/format";
import { seconds } from "../../lib/utils/time";
import { getTestGuilds } from "../../lib/utils/utils";

@ApplyOptions<ICommandOptions>({
  description: "Configure bot settings",
  cooldownDelay: seconds(15),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "[option] <value>",
    examples: ["configure language Spanish"],
  },
  preconditions: ["DevelopmentOnly"],
  requiredUserPermissions: ["ADMINISTRATOR"],
})
export class UserCommand extends ICommand {
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    if (!interaction.guild) return;

    const oldData = this.container.client.GuildSettingsModel._cache.get(interaction.guild!.id);
    const document = await this.container.client.GuildSettingsModel.getDocument(interaction.guild!) as GuildDocument

    // Access the sub commands
    switch (interaction.options.getSubcommand()) {
      case "language":
        const languageOption = interaction.options.getString("select", true);

        this.container.client.GuildSettingsModel._cache.set(interaction.guild!.id, {
          ...oldData,
          language: languageOption,
        });

        return await this.container.client.GuildSettingsModel.CoreModel.updateOne(
          { _id: interaction.guildId },
          { $set: { language: languageOption } }
        )
          .then((res) => {
            this.container.logger.info(res);
          })
          .then(async () => {
            await interaction.reply({
              content: codeBlock(
                "diff",
                `
              - ${await this.translate(
                interaction.channel as TextChannel,
                "commands/configurations:language.success_reply",
                {
                  lang: languageOption,
                }
              )}
              `
              ),
            });
          });

      case "prefix":
        const prefixOption = interaction.options.getString("regex", true);

        this.container.client.GuildSettingsModel._cache.set(interaction.guild!.id, {
          ...oldData,
          prefix: prefixOption,
        });

        return await this.container.client.GuildSettingsModel.CoreModel.updateOne(
          { _id: interaction.guildId },
          { $set: { prefix: prefixOption } }
        )
          .then((res) => {
            this.container.logger.info(res);
          })
          .then(async () => {
            await interaction.reply({
              content: codeBlock(
                "diff",
                `
              - ${await this.translate(
                interaction.channel as TextChannel,
                "commands/configurations:prefix.success_reply",
                {
                  prefix: prefixOption,
                }
              )}
              `
              ),
            });
          });
      case "clear":
        const option = interaction.options.getBoolean("confirm", true);

        if (!document) {
          return await interaction.reply({
            content: codeBlock(
              "diff",
              `
          - No configuration found for ${interaction.guild?.name}.
          `
            ),
            ephemeral: true,
          });
        }
        if (option) {
          await interaction.reply({
            content: `The confirmation has been received... clearing the configuration...`,
          });
          this.container.client.GuildSettingsModel._cache.set(interaction.guild!.id, {
            ...oldData,
            language: "en-US",
            prefix: ENV.bot.prefix,
          });
          await this.container.client.GuildSettingsModel.CoreModel.updateOne(
            { _id: interaction.guildId },
            { $set: { language: "en-US", prefix: ENV.bot.prefix } }
          )
            .then((res) => {
              this.container.logger.info(res);
            })
            .then((res) => {
              this.container.logger.info(res);
            })
            .catch((err) => {
              this.container.logger.error(err);
            });
          return await interaction.channel?.send({
            content: `The configuration has been cleared. You can view the default configuration by running \`/configure view\``,
          });
          // return collector.stop("success");
        } else {
          return await interaction.reply({
            content: `The confirmation has been received... cancelling...`,
          });
        }
      case "view":
        const welcomeData = await this.container.client.GuildSettingsModel.WelcomeModel.findOne({ _id: interaction.guildId });

        return await interaction.reply({
          content: codeBlock(
            "css",
            `
          ${
            !(interaction.guild instanceof Guild) || interaction.guild.name.length > 25
              ? interaction.guild?.name
              : "Server"
          } - Configuration Settings
          
          [ Current Language ] = ${document.language ?? "en-US"}
          [ Current Prefix   ] = ${document?.prefix ?? this.container.client.environment.bot.prefix}
          [ Welcome Plugin   ] = ${welcomeData?.enabled ? "Enabled" : "Disabled"}
          `
          ),
          ephemeral: true,
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
              .setName("language")
              .setDescription("Sets the active language the bot will use.")
              .addStringOption((stringOption) =>
                stringOption
                  .setName("select")
                  .setDescription("Select the language you want to use.")
                  .addChoices([
                    ["English", "en-US"],
                    ["Espanol", "en-ES"],
                    ["Portuguese", "pt-BR"],
                  ])
                  .setRequired(true)
              )
          )
          .addSubcommand((options) =>
            options
              .setName("prefix")
              .setDescription("Sets the prefix the bot will use.")
              .addStringOption((stringOption) =>
                stringOption.setName("regex").setDescription("The prefix string expression.").setRequired(true)
              )
          )
          .addSubcommand((options) =>
            options
              .setName("clear")
              .setDescription("Clear all settings")
              .addBooleanOption((booleanOption) =>
                booleanOption
                  .setName("confirm")
                  .setDescription("Confirm that you want to clear all settings.")
                  .setRequired(true)
              )
          )
          .addSubcommand((options) => options.setName("view").setDescription("View the current settings.")),
      {
        guildIds: getTestGuilds(),
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["972952650926682173"],
      }
    );
  }
}
