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
import Docs from "discord.js-docs";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { seconds } from "../../lib/utils/time";
import { TextChannel } from "discord.js";
import { getTestGuilds } from "../../lib/utils/utils";

@ApplyOptions<ICommandOptions>({
  description: "Read the discord.js documentation.",
  cooldownDelay: seconds(11),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "[query]",
    examples: ["djs Interaction", "djs ClientOptions"],
    command_type: "slash",
  },
  chatInputCommand: {
    register: ENV.bot.register_commands,
    guildIds: ENV.bot.test_guild_id,
    behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
  },
  preconditions: ["OwnerOnly"],
})
export class UserCommand extends ICommand {
  // Slash Based Command
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const branch = "stable";

    const userQuery = interaction.options.getString("query", true);

    const doc = await Docs.fetch(branch, {
      force: true,
    });

    const result = doc.resolveEmbed(userQuery);

    if (!result) {
      return interaction.reply({
        content: await this.translate(
          interaction.channel as TextChannel,
          "commands/developer:djs_command.no_results_found",
          {
            query: userQuery,
          }
        ),
      });
    }

    const replaceDisco = (str: string) =>
      str.replace(/docs\/docs\/disco/g, `docs/discord.js/${branch}`).replace(/ \(disco\)/g, "");

    const string = replaceDisco(JSON.stringify(result));

    const embed = JSON.parse(string);

    embed.author.url = `https://discord.js.org/#/docs/discord.js/${branch}/general/welcome`;

    const extra =
      "\n\nView more here: " +
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        .exec(embed.description)![0]
        .split(")")[0];

    const max = 1024;

    for (const field of embed.fields || []) {
      if (field.value.length >= max) {
        field.value = field.value.slice(0, max);
        const split = field.value.split(" ");
        let joined = split.join(" ");

        while (joined.length >= max - extra.length) {
          split.pop();
          joined = split.join(" ");
        }

        field.value = joined + extra;
      }
    }

    if (embed.fields && embed.fields[embed.fields.length - 1].value.startsWith("[View source")) {
      embed.fields.pop();
    }

    return await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }
  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((s) => {
            return s
              .setName("query")
              .setRequired(true)
              .setDescription("The query to search for from the discord.js documentation.");
          }),
      {
        guildIds: getTestGuilds(),
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["964542816921460906"],
      }
    );
  }
}
