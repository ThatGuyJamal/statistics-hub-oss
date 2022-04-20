import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions, Events, Listener } from "@sapphire/framework";
import { Message } from "discord.js";
import { isGuildMessage } from "../../lib/utils/guards";

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate,
})
export class UserEvent extends Listener {
  public async run(ctx: Message) {
    if (ctx.partial || !isGuildMessage(ctx) || ctx.author.bot) return;

    const fetch = await this.container.client.GuildSettingsModel.getDocument(ctx.guild);

    if(!fetch) {
      await this.container.client.GuildSettingsModel._model.create({
        _id: ctx.guild.id,
        guild_name: ctx.guild.name,
        data: {
          member: {
            guildJoins: 0,
            guildLeaves: 0,
            lastJoin: null,
            guildBans: 0
          },
          message: 1,
          voice: 0,
          channel: {
            created: 0,
            deleted: 0,
          }
        }
      }).then((res) => {
        this.container.logger.info(res);
      })
    } else {
      await this.container.client.GuildSettingsModel._model.updateOne({
        _id: ctx.guild.id
      }, {
        $inc: {
          "data.message": 1
        }
      }).then((res) => {
        this.container.logger.info(res);
      })
    }
  }
}
