import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand } from "@sapphire/framework";
import { Message } from "discord.js";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { BaseEmbed } from "../../lib/utils/embed";
import { codeBlock } from "../../lib/utils/format";
import { seconds } from "../../lib/utils/time";

@ApplyOptions<ICommandOptions>({
  aliases: ["active-guilds", "cached-guilds"],
  description: "View the current bot guilds cached.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    command_type: "message",
  },
  preconditions: ["OwnerOnly"],
})
export class UserCommand extends ICommand {
  // Message Based Command
  public async messageRun(ctx: Message) {
    const embed = new BaseEmbed()
      .setDescription(
        `${codeBlock(
          "css",
          `
        [Active Guilds] - ${this.container.client.guilds.cache.size}
        `
        )}
        `
      )
      .setTimestamp()
      .setColor("DARK_ORANGE");

    const limit = [];

    for (const guild of this.container.client.guilds.cache.values()) {
      // Make sure we dont go over the limit
      if (limit.length > 15) {
        break;
      } else {
        embed.addField(`${guild.name}`, `Id: ${guild.id} | Members: ${guild.memberCount}`, true);
        limit.push(guild.id);
      }
    }

    return ctx.reply({
      embeds: [embed],
    });
  }

  // Slash Based Command
  //   public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {}
  // slash command registry
  //   public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
  //     registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
  //       guildIds: [ENV.bot.test_guild_id],
  //       registerCommandIfMissing: ENV.bot.register_commands,
  //       behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
  //       idHints: [],
  //     });
  //   }
}
