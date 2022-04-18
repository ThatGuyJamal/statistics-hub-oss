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

      await this.container.client.EventLogger.joinLogs(guild, guildEventLevel.join, msg);
    } catch (error) {
      this.container.client.logger.error(error);
    }
  }
}
