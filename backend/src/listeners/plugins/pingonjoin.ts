import { ApplyOptions } from "@sapphire/decorators";
import { container, Events, Listener, ListenerOptions } from "@sapphire/framework";
import { GuildMember } from "discord.js";
import { CustomEventEmitter, customPluginEvents } from "../../internal/emitter";

@ApplyOptions<ListenerOptions>({
  name: "pingonjoin-plugin-event",
  event: Events.GuildMemberAdd,
})
export class UserEvent extends Listener {
  public async run(member: GuildMember): Promise<void> {
    const { client } = this.container;

    CustomEventEmitter.emit(customPluginEvents.PING_TO_JOIN, client, member);
  }
}
