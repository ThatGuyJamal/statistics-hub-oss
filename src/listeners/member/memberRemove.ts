import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { GuildMember } from "discord.js";

@ApplyOptions<ListenerOptions>({
  event: Events.GuildMemberRemove,
})
export class UserEvent extends Listener {
  public async run(member: GuildMember): Promise<void> {
    this.container.client.TemporaryCaches.MemberCache.save(member.guild, "guildLeaves" ,1)
  }
}
