import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions, Events, Listener } from "@sapphire/framework";
import { Message } from "discord.js";
import { isGuildMessage } from "../../lib/utils/guards";

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate,
})
export class UserEvent extends Listener {
  public run(ctx: Message) {
    if (ctx.partial || !isGuildMessage(ctx) || ctx.author.bot) return;

    this.container.client.MessageCache.save(ctx.guild, 1);
  }
}
