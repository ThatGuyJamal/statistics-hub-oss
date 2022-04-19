import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand } from "@sapphire/framework";
import { Message } from "discord.js";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { seconds } from "../../lib/utils/time";
import { codeBlock } from "../../lib/utils/format";
import { pauseThread } from "../../lib/utils/promises";

@ApplyOptions<ICommandOptions>({
  description: "Checks the current active cache for this server",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  preconditions: ["OwnerOnly"],
})
export class UserCommand extends ICommand {
  // Message Based Command
  public async messageRun(ctx: Message) {
    ctx.channel.send("This command is not available in this context. Please use slash commands.").then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, seconds(7));
    });
  }
  // Slash Based Command
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const msg = this.container.client.TemporaryCaches.MessageCache.collection.get(interaction.guildId!) ?? 0
    const mem = this.container.client.TemporaryCaches.MemberCache.size ?? 0

    await interaction.reply({
      content: `Fetching data...`,
    });

    await pauseThread(2, "seconds", "Cache Command");

    return await interaction.editReply({
      content: codeBlock(
        "css",
        `
            Server Cache
            [Message Size] = ${msg ?? 0}
            [Member Size]  = ${mem ?? 0}

            Total Cached = ${msg + mem}
            `
      ),
    });
  }
  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: [ENV.bot.test_guild_id],
      registerCommandIfMissing: ENV.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: ["966100577790607460"],
    });
  }
}
