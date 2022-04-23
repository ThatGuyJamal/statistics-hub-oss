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
import { TextChannel } from "discord.js";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { DefaultDataModelObject } from "../../lib/database";
import { BaseEmbed } from "../../lib/utils/embed";
import { codeBlock } from "../../lib/utils/format";
import { pauseThread } from "../../lib/utils/promises";
import { seconds } from "../../lib/utils/time";

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
  preconditions: ["development"],
  requiredUserPermissions: ["ADMINISTRATOR"],
})
export class UserCommand extends ICommand {
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    if (!interaction.guild) return;

    // Access the sub commands
    switch (interaction.options.getSubcommand()) {
      case "language":
        // fetches the language option we want
        const result = interaction.options.getString("select", true);

        await interaction.reply({
          content: `Saving configuration...`,
        });

        await pauseThread(3, "seconds", "Configure Command").then(async () => {
          // Make sure to update the current cache if the language is changed
          const oldData = this.container.client.GuildSettingsModel._cache.get(interaction.guild!.id);
          if (oldData) {
            this.container.client.GuildSettingsModel._cache.set(interaction.guild!.id, {
              _id: interaction.guild!.id,
              guild_name: interaction.guild!.name,
              language: result,
              blacklisted: oldData.blacklisted,
              data: oldData.data ?? DefaultDataModelObject,
              disabled_commands: oldData.disabled_commands,
            });
          }

          await this.container.client.GuildSettingsModel._model
            .updateOne({ _id: interaction.guildId }, { $set: { language: result } })
            .then((res) => {
              this.container.logger.info(res);
            })
            .catch((err) => {
              this.container.logger.error(err);
            });

          return await interaction.reply({
            embeds: [
              new BaseEmbed().interactionEmbed(
                {
                  description: await this.translate(
                    interaction.channel as TextChannel,
                    "commands/configurations:language.success_reply",
                    {
                      lang: result,
                    }
                  ),
                },
                interaction
              ),
            ],
          });
        });
      case "prefix":
        // fetches the prefix option we want
        const _prefix = interaction.options.getString("regex", true);

        // Make sure to update the cache if the prefix is changed
        const oldData = this.container.client.GuildSettingsModel._cache.get(interaction.guild!.id);
        if (oldData) {
          this.container.client.GuildSettingsModel._cache.set(interaction.guild!.id, {
            _id: interaction.guild!.id,
            guild_name: interaction.guild!.name,
            language: oldData.language,
            prefix: _prefix,
            blacklisted: oldData.blacklisted,
            data: oldData.data ?? DefaultDataModelObject,
            disabled_commands: oldData.disabled_commands,
          });
        }

        await this.container.client.GuildSettingsModel._model
          .updateOne({ _id: interaction.guildId }, { $set: { prefix: _prefix } })
          .then((res) => {
            this.container.logger.info(res);
          })
          .catch((err) => {
            this.container.logger.error(err);
          });

        return await interaction.reply({
          embeds: [
            new BaseEmbed().interactionEmbed(
              {
                description: await this.translate(
                  interaction.channel as TextChannel,
                  "commands/configurations:prefix.success_reply",
                  {
                    prefix: _prefix,
                  }
                ),
              },
              interaction
            ),
          ],
        });
      case "clear":
        return await interaction.reply({
          content: `Not yet implemented.`,
        });

      case "view":
        const data = await this.container.client.GuildSettingsModel.getDocument(interaction.guild!);

        if (!data) {
          return await interaction.reply({
            content: codeBlock(
              "diff",
              `
          - No configuration found for ${interaction.guild.name}.
          `
            ),
          });
        }

        return await interaction.reply({
          content: codeBlock(
            "css",
            `
          ${interaction.guild.name.length > 25 ? interaction.guild.name : "Server"} Settings
          
          [Current Language] = ${data.language ?? "en-US"}
          [Current Prefix] = ${data.prefix ?? this.container.client.environment.bot.prefix}
          `
          ),
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
        guildIds: ENV.bot.test_guild_id,
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["966111289652969532"],
      }
    );
  }
}
