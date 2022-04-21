import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { GuildChannel } from "discord.js";

@ApplyOptions<ListenerOptions>({
  event: Events.ChannelDelete,
})
export class UserEvent extends Listener {
  public async run(channel: GuildChannel): Promise<void> {
    const fetch = await this.container.client.GuildSettingsModel.getDocument(channel.guild);

    if (!fetch) {
      await this.container.client.GuildSettingsModel._model
        .create({
          _id: channel.guildId,
          guild_name: channel.guild.name,
          data: {
            member: {
              guildJoins: 0,
              guildLeaves: 0,
              lastJoin: null,
              guildBans: 0,
            },
            message: 0,
            voice: 0,
            channel: {
              created: 0,
              deleted: 1,
            },
          },
        })
        .then((res) => {
          this.container.logger.info(res);
        });
    } else {
      await this.container.client.GuildSettingsModel._model
        .updateOne(
          {
            _id: channel.guildId,
          },
          {
            $inc: {
              "data.channel.deleted": 1,
            },
          }
        )
        .then((res) => {
          this.container.logger.info(res);
        });
    }
  }
}
