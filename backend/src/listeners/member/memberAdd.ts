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
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import { GuildMember } from "discord.js";

@ApplyOptions<ListenerOptions>({
  event: Events.GuildMemberAdd,
})
export class UserEvent extends Listener {
  public async run(member: GuildMember): Promise<void> {
    const fetch = await this.container.client.GuildSettingsModel.getDocument(member.guild);

    if (!fetch) {
      await this.container.client.GuildSettingsModel._model
        .create({
          _id: member.guild.id,
          guild_name: member.guild.name,
          data: {
            member: {
              guildJoins: 1,
              guildLeaves: 0,
              lastJoin: new Date(),
              guildBans: 0,
            },
            message: 0,
            voice: 0,
            channel: {
              created: 0,
              deleted: 0,
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
            _id: member.guild.id,
          },
          {
            $inc: {
              "data.member.guildJoins": 1,
            },
            $set: {
              "data.member.lastJoin": new Date(),
            },
          }
        )
        .then((res) => {
          this.container.logger.info(res);
        });
    }
  }
}
