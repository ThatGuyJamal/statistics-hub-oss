import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { VoiceState } from "discord.js";
import { DefaultGuildDataModelObject } from "../../lib/database";

@ApplyOptions<ListenerOptions>({
  event: Events.VoiceStateUpdate,
})
export class UserEvent extends Listener {
  public async run(voice: VoiceState): Promise<void> {
    const fetch = await this.container.client.GuildSettingsModel.getDocument(voice.guild);

    if (!fetch) {
      await this.container.client.GuildSettingsModel.CoreModel.create({
        _id: voice.guild.id,
        guild_name: voice.guild.name,
        data: DefaultGuildDataModelObject,
      }).then((res) => {
        this.container.logger.info(res);
      });
    } else {
      await this.container.client.GuildSettingsModel.CoreModel.updateOne(
        {
          _id: voice.guild.id,
        },
        {
          $inc: {
            "data.voice": 1,
          },
        }
      ).then((res) => {
        this.container.logger.info(res);
      });
    }
  }
}
