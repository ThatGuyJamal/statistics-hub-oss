import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions, Events, Listener } from "@sapphire/framework";
import { Message, DMChannel } from "discord.js";
import { ENV } from "../../config";
import { translate } from "../../lib/il8n/translate";
import { isPrivateMessage } from "../../lib/utils/guards";

@ApplyOptions<ListenerOptions>({
  event: Events.MentionPrefixOnly,
})
export class UserEvent extends Listener {
  public async run(ctx: Message) {
    if (!isPrivateMessage(ctx)) {
      let query = await this.container.client.GuildSettingsModel.getDocument(ctx.guild!);

      await ctx.channel.send({
        content: await translate(ctx.channel as DMChannel, "events/errors:prefix_mention_reply_guild"),
      });
    } else {
      await ctx.channel.send({
        content: await translate(ctx.channel, "events/errors:prefix_mention_reply_dm", {
          prefix: ENV.bot.prefix,
        }),
      });
    }
  }
}
