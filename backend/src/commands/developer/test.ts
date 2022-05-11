import { ApplyOptions } from "@sapphire/decorators";
import { Args, BucketScope } from "@sapphire/framework";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { pauseThread } from "../../internal/functions/promises";
import { seconds } from "../../internal/functions/time";

const errorTracked = [];

@ApplyOptions<ICommandOptions>({
  description: "Test command for some stuff :/",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    hidden: true,
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    await ctx.channel.send({ content: `Starting test...` });
    const { client } = this.container;
    try {
      await this.testCode(ctx, args);
    } catch (e) {
      errorTracked.push(1);
      client.logger.error(e);
      await ctx.channel.send({
        embeds: [
          {
            description: `Error: ${e}`,
          },
        ],
      });
    }
    await ctx.channel.send({
      content: `Test finished! ${
        errorTracked.length > 0
          ? `${errorTracked.length} error${errorTracked.length < 1 ? "" : "s"} were tracked. Check the logs...`
          : ""
      }`,
    });
  }

  /**
   * The test code to run
   * @param ctx
   */
  private async testCode(ctx: Message, args: Args) {
    ctx.channel.send("Working on it...");
    const text = await args.pick("string").catch(() => null);
    if (!text) {
      return ctx.reply("No prefix was given as an argument!");
    }

    return ctx.reply(`Prefix is: **${text}**`);
  }
  // public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) { }
  // public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
  //     registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
  //         guildIds: getTestGuilds(),
  //         registerCommandIfMissing: environment.bot.register_commands,
  //         behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
  //         idHints: [],
  //     });
  // }
}
