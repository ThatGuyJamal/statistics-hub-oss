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
import { ApplicationCommandRegistry, Args, BucketScope, RegisterBehavior } from "@sapphire/framework";
import { Message, CommandInteraction, TextChannel, AutocompleteInteraction } from "discord.js";
import Fuse from "fuse.js";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { BrandingColors } from "../../lib/utils/colors";
import { BaseEmbed } from "../../lib/utils/embed";
import { capitalizeFirstLetter, inlineCode } from "../../lib/utils/format";
import { seconds } from "../../lib/utils/time";
import { getTestGuilds } from "../../lib/utils/utils";

@ApplyOptions<ICommandOptions>({
  aliases: ["help", "commands"],
  description: "Advanced Command help system.",
  cooldownDelay: seconds(20),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  fullCategory: ["miscellaneous"],
  extendedDescription: {
    usage: "[query]",
    examples: ["commands ping"],
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  // Message Based Command
  public async messageRun(ctx: Message, _args: Args): Promise<Message<boolean>> {
    return await ctx.reply({
      embeds: [await this.__initCommandHandler(ctx, this, "GENERAL")],
    });
  }
  // Slash Based Command
  public override async chatInputRun(interaction: CommandInteraction): Promise<any> {
    const specifiedCommand = interaction.options.getString("search", false);

    await interaction.deferReply();

    if (specifiedCommand) {
      const command = await this.__resolveCommand(specifiedCommand);
      if (command) {
        return await interaction.editReply({
          embeds: [await this.__initCommandHandler(interaction, command, "COMMAND")],
        });
      } else {
        return await interaction.editReply({
          embeds: [
            new BaseEmbed()
              .interactionEmbed(
                {
                  description: await this.translate(
                    interaction.channel as TextChannel,
                    "commands/miscellaneous:help_command_general.invalid",
                    {
                      replace: {
                        cmd: specifiedCommand,
                      },
                    }
                  ),
                  color: BrandingColors.Error,
                },
                interaction
              )
              .setTimestamp(),
          ],
        });
      }
    } else {
      return await interaction.editReply({
        embeds: [await this.__initCommandHandler(interaction, this, "GENERAL")],
      });
    }
  }

  /**
   * Allows autocomplete for command search
   * @param interaction
   */
  public override async autocompleteRun(interaction: AutocompleteInteraction) {
    const query = interaction.options.getFocused() as string;

    const options = this.container.stores.get("commands");

    if (!query) {
      let owner = ENV.developer.discord_dev_ids.includes(interaction.user.id);

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
      results.map(({ item }) => ({
        name: `${item.name}`,
        value: item.name,
      }))
    );
  }

  /**
   * Loads our methods to the interaction handler.
   * @param ctx
   * @param command
   * @param type
   * @private
   */
  private async __initCommandHandler(
    ctx: CommandInteraction | Message,
    command: ICommand,
    type: "GENERAL" | "COMMAND"
  ): Promise<BaseEmbed> {
    if (ctx instanceof Message) {
      if (type == "GENERAL") {
        return this.__buildGeneralInformation(ctx);
      } else {
        return this.__buildCommandInformation(ctx, command);
      }
    } else {
      if (type == "GENERAL") {
        return this.__buildGeneralInformation(ctx);
      } else {
        return this.__buildCommandInformation(ctx, command);
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
   * Builds the general information embed if no command is specified.
   * @param ctx
   * @private
   */
  private async __buildGeneralInformation(ctx: CommandInteraction | Message): Promise<BaseEmbed> {
    const embed = new BaseEmbed({
      author: {
        name: `${this.container.client.user?.username ?? this.container.client.environment.bot.name}`,
        iconURL: this.container.client.user?.displayAvatarURL(),
      },
      description:
        ctx instanceof Message
          ? await this.translate(
              ctx.channel as TextChannel,
              "commands/miscellaneous:help_command_general.description",
              {
                replace: {
                  user: ctx.author.tag,
                },
              }
            )
          : await this.translate(
              ctx.channel as TextChannel,
              "commands/miscellaneous:help_command_general.description",
              {
                replace: {
                  user: ctx.user.tag,
                },
              }
            ),
      footer: {
        text: await this.translate(ctx.channel as TextChannel, "commands/miscellaneous:help_command_general.footer"),
      },
      color: BrandingColors.Legacy,
    }).setTimestamp();

    const commands = this.container.stores.get("commands");

    for (const category of commands.categories) {
      // Filters through each command based on the category and builds the embed for each category.
      let filteredCommand = [...this.container.stores.get("commands").values()]
        .filter((c) => c.category === category)
        .map((c) => c.name);
      // sends the new command to the embed formatted.
      embed.addField(capitalizeFirstLetter(category), `\`\`\`${filteredCommand.join("\n")}\`\`\``, true);
    }

    embed.addField(
      "Links",
      `[Documentation](${this.container.client.environment.developer.documentation_link}), [GitHub](${this.container.client.environment.developer.github_link}), [SupportServer](${this.container.client.environment.bot.server_link})`,
      false
    );

    return embed;
  }

  /**
   * Builds the command information embed if a command is specified.
   * @param ctx The command interaction.
   * @param command The command to build information for.
   * @private
   */
  private async __buildCommandInformation(ctx: CommandInteraction | Message, command: ICommand): Promise<BaseEmbed> {
    const embed = new BaseEmbed({
      author: {
        name: await this.translate(ctx.channel as TextChannel, "commands/miscellaneous:help_command_general.title2", {
          replace: {
            command: capitalizeFirstLetter(command.name),
            category: command.category ?? "None Found",
          },
        }),
      },
      color: BrandingColors.Primary,
    })
      .setTimestamp()
      .setFooter({
        text: await this.translate(ctx.channel as TextChannel, "commands/miscellaneous:help_command_general.footer"),
      });

    const aliases =
      command.aliases.length > 0
        ? command.aliases.join(", ")
        : await this.translate(ctx.channel as TextChannel, "commands/miscellaneous:help_command_general.null_aliases");

    const usage = command.extendedDescription?.usage
      ? `/${command.name} ${command.extendedDescription.usage}`
      : await this.translate(ctx.channel as TextChannel, "commands/miscellaneous:help_command_general.null_usage");

    const examples = command.extendedDescription?.examples
      ? command.extendedDescription.examples.map((example) => `/${example}`).join("\n")
      : await this.translate(ctx.channel as TextChannel, "commands/miscellaneous:help_command_general.null_examples");

    const command_type = command.extendedDescription?.command_type
      ? command.extendedDescription.command_type
      : await this.translate(
          ctx.channel as TextChannel,
          "commands/miscellaneous:help_command_general.null_command_type"
        );

    // embed description
    command.description
      ? embed.addField(
          "Description",
          inlineCode(
            await this.translate(
              ctx.channel as TextChannel,
              `commands/${command.category}:${command.name}_command.help_description`
            )
          ),
          false
        )
      : embed.addField(
          "Description",
          inlineCode(
            await this.translate(
              ctx.channel as TextChannel,
              `commands/miscellaneous:help_command_general.null_description`
            )
          ),
          false
        );

    // examples embed addition
    embed.addField(
      await this.translate(ctx.channel as TextChannel, "commands/miscellaneous:help_command_general.examples_title"),
      `${inlineCode(examples)}`,
      false
    );

    // embed command type
    embed.addField("Command Type", inlineCode(command_type), true);

    // aliases embed addition
    embed.addField(
      await this.translate(ctx.channel as TextChannel, "commands/miscellaneous:help_command_general.alias_title"),
      `${inlineCode(aliases)}`,
      true
    );

    // usage embed addition
    embed.addField(
      await this.translate(ctx.channel as TextChannel, "commands/miscellaneous:help_command_general.usage_title"),
      `${inlineCode(usage)}`,
      true
    );

    return embed;
  }

  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((opt) => {
            return opt
              .setName("search")
              .setDescription("The command data to search.")
              .setRequired(false)
              .setAutocomplete(true);
          }),
      {
        guildIds: getTestGuilds(),
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["964236971163672667"],
      }
    );
  }
}
