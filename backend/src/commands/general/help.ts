import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand, Args } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
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
    usage: "help <command>",
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
${[...this.container.stores.get("commands").values()]
            .map((c) => `[${c.category}] = ${c.name}`).join("\n")}

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
            .map((c) => `[${c.category}] = ${c.name}`).join("\n")}

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
          content: await this.translate(ctx.channel as TextChannel, "commands/general:command_not_found"),
        });
      } else {

        // Make sure only dev's get info on this command.
        if (commandFound.category === "developer" && !client.BotDevelopers.has(ctx.author.id)) {
          return await ctx.reply({
            content: await this.translate(ctx.channel as TextChannel, "commands/config:help_command.developer_command_only"),
          });
        }

        return await ctx.reply({
          content: codeBlock("css",
            `
              === ${capitalizeFirstLetter(commandFound.name)} Command ===
              [Description] = ${commandFound.description || "No description provided."}
              [Aliases] = ${commandFound.aliases.join(", ") || "None"}
              [Category] = ${commandFound.category || "None"}
              [Usage] = ${commandFound.extendedDescription?.usage || "None"}
              [Examples] = ${commandFound.extendedDescription?.examples?.join(", ") || "None"}
              [Command type] = ${commandFound.extendedDescription?.command_type}
            `)
        })
      }
    }
  }

  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    interaction.reply("soon");
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

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: getTestGuilds(),
      registerCommandIfMissing: environment.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: ["97360358034076473"],
    });
  }
}
