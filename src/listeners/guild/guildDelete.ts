/**
 *  Statistics Hub OSS - A data analytics discord bot.
    
    Copyright (C) 2022, ThatGuyJamal and contributors

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.
 */

import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions, Events, Listener } from "@sapphire/framework";
import { Guild } from "discord.js";
import { guildEventLevel } from "../../lib/controllers/statistics/logger";

@ApplyOptions<ListenerOptions>({
  event: Events.GuildDelete,
})
export class UserEvent extends Listener {
  public async run(guild: Guild): Promise<void> {
    const { client } = this.container;

    try {
      let msg = `❌ ${this.container.client.environment.bot.name} has been removed from \`${guild.name} | id:(${guild.id})\` **Now in** \`${client.guilds.cache.size} servers.\``;
      await this.container.client.EventLogger.joinLogs(guild, guildEventLevel.leave, msg);
    } catch (error) {
      this.container.client.logger.error(error);
    }
  }
}
