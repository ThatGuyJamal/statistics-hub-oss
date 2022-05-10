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
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand, Args } from "@sapphire/framework";
import { AutocompleteInteraction, Message, TextChannel } from "discord.js";
import Fuse from "discord.js-docs/node_modules/fuse.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { capitalizeFirstLetter, codeBlock } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";

@ApplyOptions<ICommandOptions>({
  description: "Shows information about the commands and how to use them.",
  aliases: ["h", "commands", "cmds"],
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "help <command name>",
    examples: ["help ping", "help prefix"],
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    const { client } = this.container;

    const commandName = await args.pick("string").catch(() => null);

    if (!commandName) {
      if (client.BotDevelopers.has(ctx.author.id)) {
        let result = codeBlock(
          "css",
          `
=== Command list ===
${[...this.container.stores.get("commands").values()].map((c) => `[${c.category}] = ${c.name}`).join("\n")}

You can run help <command> to get more information about a command.
      `
        );
        return await ctx.reply({
          content: result,
        });
      } else {
        let result = codeBlock(
          "css",
          `
=== Command list ===
${[...this.container.stores.get("commands").values()]
  .filter((c) => c.category !== "developer")
  .map((c) => `[${c.category}] = ${c.name}`)
  .join("\n")}

You can run help <command> to get more information about a command.
      `
        );
        return await ctx.reply({
          content: result,
        });
      }
    } else {
      const commandFound = await this.__resolveCommand(commandName);
      if (!commandFound) {
        return await ctx.reply({
          content: await this.translate(ctx.channel as TextChannel, "commands/general:help_command.command_not_found"),
        });
      } else {
        // Make sure only dev's get info on this command.
        if (commandFound.category === "developer" && !client.BotDevelopers.has(ctx.author.id)) {
          return await ctx.reply({
            content: await this.translate(
              ctx.channel as TextChannel,
              "commands/config:help_command.developer_command_only"
            ),
          });
        }

        return await ctx.reply({
          content: codeBlock(
            "css",
            `
              === ${capitalizeFirstLetter(commandFound.name)} Command ===
              [Description] = ${commandFound.description || "No description provided."}
              [Aliases] = ${commandFound.aliases.join(", ") || "None"}
              [Category] = ${commandFound.category || "None"}
              [Usage] = ${commandFound.extendedDescription?.usage || "None"}
              [Examples] = ${commandFound.extendedDescription?.examples?.join(", ") || "None"}
              [Command type] = ${commandFound.extendedDescription?.command_type}
              [Subcommands] = ${commandFound.extendedDescription?.subcommands?.map((name) => name).join(", ") || "None"}
              ${
                commandFound.extendedDescription?.subcommands?.length! > 0
                  ? `[Note] = Subcommands can be used with slash commands. There syntax is as follows: ${commandFound.name} <subcommand> `
                  : ""
              }
            `
          ),
        });
      }
    }
  }

  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const { client } = this.container;

    const commandName = interaction.options.getString("name", false);

    if (!commandName) {
      if (client.BotDevelopers.has(interaction.user.id)) {
        let result = codeBlock(
          "css",
          `
=== Command list ===
${[...this.container.stores.get("commands").values()].map((c) => `[${c.category}] = ${c.name}`).join("\n")}

You can run help <command> to get more information about a command.
      `
        );
        return await interaction.reply({
          content: result,
        });
      } else {
        let result = codeBlock(
          "css",
          `
=== Command list ===
${[...this.container.stores.get("commands").values()]
  .filter((c) => c.category !== "developer")
  .map((c) => `[${c.category}] = ${c.name}`)
  .join("\n")}

You can run help <command> to get more information about a command.
      `
        );
        return await interaction.reply({
          content: result,
        });
      }
    } else {
      const commandFound = await this.__resolveCommand(commandName);
      if (!commandFound) {
        return await interaction.reply({
          content: await this.translate(
            interaction.channel as TextChannel,
            "commands/general:help_command.command_not_found"
          ),
        });
      } else {
        // Make sure only dev's get info on this command.
        if (commandFound.category === "developer" && !client.BotDevelopers.has(interaction.user.id)) {
          return await interaction.reply({
            content: await this.translate(
              interaction.channel as TextChannel,
              "commands/config:help_command.developer_command_only"
            ),
          });
        }

        return await interaction.reply({
          content: codeBlock(
            "css",
            `
              === ${capitalizeFirstLetter(commandFound.name)} Command ===
              [Description] = ${commandFound.description || "No description provided."}
              [Aliases] = ${commandFound.aliases.join(", ") || "None"}
              [Category] = ${commandFound.category || "None"}
              [Usage] = ${commandFound.extendedDescription?.usage || "None"}
              [Examples] = ${commandFound.extendedDescription?.examples?.join(", ") || "None"}
              [Command type] = ${commandFound.extendedDescription?.command_type}
              [Subcommands] = ${commandFound.extendedDescription?.subcommands?.map((name) => name).join(", ") || "None"}
              ${
                commandFound.extendedDescription?.subcommands?.length! > 0
                  ? `[Note] = Subcommands can be used with slash commands. There syntax is as follows: ${commandFound.name} <subcommand> `
                  : ""
              }
            `
          ),
        });
      }
    }
  }

  /**
   * Resolves a command by name.
   * @param providedCommand The command name to resolve.
   * @private
   */
  private async __resolveCommand(providedCommand: string): Promise<ICommand | undefined> {
    const command = this.container.stores.get("commands").get(providedCommand.toLowerCase()) as ICommand | undefined;

    return command === undefined ? undefined : command;
  }

  /**
   * Allows autocomplete for command search
   * @param interaction
   */
  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    const query = interaction.options.getFocused() as string;

    const options = this.container.stores.get("commands");

    if (!query) {
      let owner = environment.bot.developerMetaData.discord_dev_ids.includes(interaction.user.id);

      /**
       * This function filters out commands to the user. If the user is not a dev, it will return all non developer commands.
       * It will then map the command and return there name to the slash autocomplete api.
       */
      return await interaction.respond(
        [...options.values()]
          .filter((cmd) => (owner ? true : cmd.category !== "developer"))
          .map((item) => ({
            name: `${item.name}`,
            value: item.name,
          }))
      );
    }

    const fuzzerSearcher = new Fuse([...options.values()], { keys: ["name"] });
    const results = fuzzerSearcher.search(query.toLowerCase(), { limit: 25 });

    return await interaction.respond(
      results.map((item) => ({
        name: `${item.name}`,
        value: item.name,
      }))
    );
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((options) =>
            options
              .setName("name")
              .setDescription("The name of the command you wish to learn more about.")
              .setRequired(false)
          ),
      {
        guildIds: getTestGuilds(),
        registerCommandIfMissing: environment.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["97360358034076473"],
      }
    );
  }
}
