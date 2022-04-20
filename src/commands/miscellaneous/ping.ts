import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, BucketScope, ChatInputCommand, RegisterBehavior } from "@sapphire/framework";
import { send } from "@sapphire/plugin-editable-commands";
import { Message, TextChannel } from "discord.js";
import ms from "ms";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { BrandingColors } from "../../lib/utils/colors";
import { inlineCode } from "../../lib/utils/format";
import { createEmbed } from "../../lib/utils/responses";
import { seconds } from "../../lib/utils/time";

@ApplyOptions<ICommandOptions>({
  aliases: ["pong", "latency"],
  description: "Check the bot latency with discords api.",
  detailedDescription: "Returns helpful and quick statistics on the bot latency and uptime.",
  cooldownDelay: seconds(5),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: ["GUILD_TEXT", "DM"],
  nsfw: false,
  enabled: true,
  extendedDescription: {
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  public override async messageRun(ctx: Message) {
    const msg = await send(ctx, "Ping?");

    let content = await this.translate(ctx.channel as TextChannel, "commands/miscellaneous:ping_command.description", {
      replace: {
        APILatency: inlineCode(
          `${ms((msg.editedTimestamp || msg.createdTimestamp) - (ctx.editedTimestamp || ctx.createdTimestamp))}`
        ),
        wsLatency: inlineCode(`${ms(Math.round(this.container.client.ws.ping))}`),
      },
    });
    return await send(ctx, content);
  }

  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const embed = createEmbed("", BrandingColors.Secondary).setTitle("Ping? 🏓");
    const message = (await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    })) as Message;

    const botLatency: number = Math.round(this.container.client.ws.ping);
    const apiLatency: number = message.createdTimestamp - message.createdTimestamp;
    const uptime: string = ms(this.container.client.uptime ?? 1);

    const displays = [
      ["Bot Latency", botLatency],
      ["API Latency", apiLatency],
    ].map(([name, value]) => `${name} ➡️ ${inlineCode(`${value.toString()}ms`)}`);

    const updatedEmbed = embed
      .setColor(BrandingColors.Primary)
      .setTitle("Pong! 🏓")
      .setDescription(displays.join("\n") + `\nUptime ➡️ ${inlineCode(uptime)}`);

    await interaction.editReply({ embeds: [updatedEmbed] });
  }

  /**
   * Uploads our data to discord, and creates a slash command.
   * @param registry
   */
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {
        guildIds: ENV.bot.test_guild_id,
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["964164545482473582"],
      }
    );
  }
}
