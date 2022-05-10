import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand, Args } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { codeBlock } from "../../internal/functions/formatting";
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
      const result = codeBlock(
        "css",
        `
          === Command list ===
          Coming soon...
          `
      );
      return await ctx.reply({
        content: result,
      });
    } else {
      const commandFound = await this.__resolveCommand(commandName);
      if (!commandFound) {
        return await ctx.reply({
          content: await this.translate(ctx.channel as TextChannel, "commands/general:command_not_found"),
        });
      } else {
        return await ctx.reply({
          content: codeBlock("css", 
            `
              === ${commandFound.name} ===
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
