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
import { BaseEmbed } from "../../lib/utils/embed";
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

        await pauseThread(3, "seconds", "Cache Command").then(async () => {
          // Save the language option
          this.container.client.GuildSettingsModel._model
            .updateOne({ _id: interaction.guildId }, { $set: { language: result } })
            .then((res) => {
              this.container.logger.info(res);
            })
            .catch((err) => {
              this.container.logger.error(err);
            });

          return await interaction.editReply({
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
          ),
      {
        guildIds: ENV.bot.test_guild_id,
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["966111289652969532"],
      }
    );
  }
}
