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
import { DefaultGuildDataModelObject } from "../../lib/database";

@ApplyOptions<ListenerOptions>({
  event: Events.GuildMemberRemove,
})
export class UserEvent extends Listener {
  public async run(member: GuildMember): Promise<void> {
    const fetch = await this.container.client.GuildSettingsModel.getDocument(member.guild);

    if (!fetch) {
      await this.container.client.GuildSettingsModel.CoreModel
        .create({
          _id: member.guild.id,
          guild_name: member.guild.name,
          data: DefaultGuildDataModelObject,
        })
        .then((res) => {
          this.container.logger.info(res);
        });
    } else {
      await this.container.client.GuildSettingsModel.CoreModel
        .updateOne(
          {
            _id: member.guild.id,
          },
          {
            $inc: {
              "data.member.guildLeaves": 1,
            },
          }
        )
        .then((res) => {
          this.container.logger.info(res);
        });
    }
  }
}
