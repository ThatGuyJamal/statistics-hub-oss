import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, RegisterBehavior, ChatInputCommand, ApplicationCommandRegistry } from "@sapphire/framework";
import { Message, MessageActionRow, MessageButton } from "discord.js";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { BaseEmbed } from "../../lib/utils/embed";
import { createHyperLink } from "../../lib/utils/format";
import { seconds } from "../../lib/utils/time";

@ApplyOptions<ICommandOptions>({
  description: "Add the bot to your server.",
  cooldownDelay: seconds(30),
  cooldownScope: BucketScope.User,
  cooldownLimit: 1,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  chatInputCommand: {
    register: ENV.bot.register_commands,
    guildIds: [ENV.bot.test_guild_id],
    behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
    idHints: ["837830514130812970"],
  },
  extendedDescription: {
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  // Message Based Command
  public async messageRun(ctx: Message) {
    return ctx.reply({
      embeds: [
        new BaseEmbed().contextEmbed(
          {
            description: createHyperLink("Discord Bot Invite link", ENV.bot.invite_url),
          },
          ctx
        ),
      ],
    });
  }
  // Slash Based Command
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    return interaction.reply({
      content: `Thanks for the interest ${interaction.user.username}! Heres my invite link...`,
      components: [
        new MessageActionRow().addComponents(
          new MessageButton().setLabel("Click me 🤍").setEmoji("📧").setStyle("LINK").setURL(`${ENV.bot.invite_url}`)
        ),
      ],
    });
  }
  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: [ENV.bot.test_guild_id],
      registerCommandIfMissing: ENV.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
    });
  }
}
