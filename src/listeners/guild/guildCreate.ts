import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions, Events, Listener } from "@sapphire/framework";
import { Guild } from "discord.js";
import { guildEventLevel } from "../../lib/controllers/statistics/logger";

@ApplyOptions<ListenerOptions>({
  event: Events.GuildCreate,
})
export class UserEvent extends Listener {
  public async run(guild: Guild): Promise<void> {
    const { client } = this.container;

    try {
      let msg = `✅ ${this.container.client.environment.bot.name} has been added to \`${guild.name} | id:(${guild.id})\` **Now in** \`${client.guilds.cache.size} servers.\``;

      // When the bot is added to a guild, we need to add the guild to the database
      this.container.client.GuildSettingsModel._model.create({
        _id: guild.id,
        guild_name: guild.name,
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
            deleted: 0,
          },
        },
      }).then((res) => {
        this.container.logger.info(res);
      });

      await this.container.client.EventLogger.joinLogs(guild, guildEventLevel.join, msg);
    } catch (error) {
      this.container.client.logger.error(error);
    }
  }
}
