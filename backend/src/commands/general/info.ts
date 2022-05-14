import { ApplyOptions } from "@sapphire/decorators";
import { BucketScope } from "@sapphire/framework";
import { Message, MessageActionRow, MessageButton } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { codeBlock } from "../../internal/functions/formatting";
import { minutes, seconds } from "../../internal/functions/time";
import { BaseEmbed } from "../../internal/structures/Embed";

@ApplyOptions<ICommandOptions>({
  name: "info",
  aliases: ["stats", "botinfo"],
  description: "Info about the bot and its host environment.",
  cooldownDelay: minutes(1),
  cooldownScope: BucketScope.User,
  cooldownLimit: 1,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    command_type: "message",
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message) {
    const reply = await ctx.reply({
      content: `Fetching data from api...`,
    });

    const result = await this.buildData();

    if (!result)
      return await reply
        .edit("An error occurred while fetching the data from the api... Please try again later.")
        .catch(() => {});

    return await reply
      .edit({
        content: `The API returned the following data:`,
        embeds: [
          new BaseEmbed().contextEmbed(
            {
              title: `About ${environment.bot.bot_full_name}`,
              fields: [
                {
                  name: "Commands Ran Today",
                  value: `${result.data.map((c) => c.commands) ?? 0}`,
                  inline: true,
                },
                {
                  name: "Users Tracked",
                  value: `${result.data.map((c) => c.users) ?? 0}`,
                  inline: true,
                },
                {
                  name: "Servers Tracked",
                  value: `${result.data.map((c) => c.servers) ?? 0}`,
                  inline: true,
                },
                {
                  name: "CPU Load",
                  value: `${result.data.map((c) => `${c.cpuload}%`) ?? 0}`,
                  inline: true,
                },
                {
                  name: "Memory Load",
                  value: `${result.data.map((c) => `${c.memload}%`) ?? 0}`,
                  inline: true,
                },
                {
                  name: "Bandwidth Usage",
                  value: `${result.data.map((c) => `${c.bandwidth}%`) ?? 0}`,
                  inline: true,
                },
                {
                  name: "Popular Commands",
                  value: codeBlock(
                    "css",
                    `
${
  result.popular
    .map((cmd) => `[${cmd.name}] = Used ${cmd.count} ${cmd.count === 1 ? "time" : "times"}`)
    .slice(0, 5)
    .join("\n") ?? 0
}
                            `
                  ),
                  inline: false,
                },
              ],
              footer: {
                text: `Thanks to StatCord for the amazing API!`,
              },
            },
            ctx
          ),
        ],
        components: [
          new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setLabel("Dashboard")
                .setEmoji("📈")
                .setStyle("LINK")
                .setURL(`${environment.bot.developerMetaData.dashboard_link}`)
            )
            .addComponents(
              new MessageButton()
                .setLabel("Documentation")
                .setEmoji("📖")
                .setStyle("LINK")
                .setURL(`${environment.bot.developerMetaData.documentation_link}`)
            ),
        ],
      })
      .catch((err) => {
        this.container.logger.error(err);
        return ctx.reply("An error occurred while fetching the data from the api... Please try again later.");
      });
  }

  private async buildData() {
    const { client } = this.container;

    return await client.StatCordHandler.statcordGet();
  }
}
