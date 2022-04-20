import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { GuildMember } from "discord.js";

@ApplyOptions<ListenerOptions>({
  event: Events.GuildMemberAdd,
})
export class UserEvent extends Listener {
  public async run(member: GuildMember): Promise<void> {

    const fetch = await this.container.client.GuildSettingsModel.getDocument(member.guild);

    if(!fetch) {
      await this.container.client.GuildSettingsModel._model.create({
        _id: member.guild.id,
        guild_name: member.guild.name,
        data: {
          member: {
            guildJoins: 1,
            guildLeaves: 0,
            lastJoin: null,
            guildBans: 0
          },
          message: 0,
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
        _id: member.guild.id
      }, {
        $inc: {
          "data.member.guildJoins": 1
        }
      }).then((res) => {
        this.container.logger.info(res);
      })
    }
  }
}
