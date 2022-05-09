import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand } from "@sapphire/framework";
import { send } from "@sapphire/plugin-editable-commands";
import { Message, TextChannel } from "discord.js";
import ms from "ms";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { codeBlock } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";

@ApplyOptions<ICommandOptions>({
  description: "Replies with the bots API latency.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message) {
    const msg = await send(
      ctx,
      `${await this.translate(ctx.channel as TextChannel, "commands/general:ping_command.reply_one")}`
    );

    const result = codeBlock(
      "diff",
      `+ ${await this.translate(ctx.channel as TextChannel, "commands/general:ping_command.reply_two", {
        replace: {
          APILatency: `${ms(
            (msg.editedTimestamp || msg.createdTimestamp) - (ctx.editedTimestamp || ctx.createdTimestamp)
          )}`,
          wsLatency: `${ms(Math.round(this.container.client.ws.ping))}`,
        },
      })}
    `
    );

    return await msg.edit({
      content: result,
    });
  }
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const result = codeBlock(
      "diff",
      `- Pong! My websocket connection took... ${ms(Math.round(this.container.client.ws.ping))} to respond.`
    );

    return await interaction.reply({
      content: result,
      ephemeral: true,
    });
  }
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: getTestGuilds(),
      registerCommandIfMissing: environment.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: ["973000992989802587"],
    });
  }
}
