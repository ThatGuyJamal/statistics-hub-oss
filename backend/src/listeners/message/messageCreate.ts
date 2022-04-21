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
import { Message } from "discord.js";
import { isGuildMessage } from "../../lib/utils/guards";

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate,
})
export class UserEvent extends Listener {
  public async run(ctx: Message) {
    if (ctx.partial || !isGuildMessage(ctx) || ctx.author.bot) return;

    const fetch = await this.container.client.GuildSettingsModel.getDocument(ctx.guild);

    if (!fetch) {
      await this.container.client.GuildSettingsModel._model
        .create({
          _id: ctx.guild.id,
          guild_name: ctx.guild.name,
          data: {
            member: {
              guildJoins: 0,
              guildLeaves: 0,
              lastJoin: null,
              guildBans: 0,
            },
            message: 1,
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
            _id: ctx.guild.id,
          },
          {
            $inc: {
              "data.message": 1,
            },
            $set: {
              guild_name: ctx.guild.name,
            }
          }
        )
        .then((res) => {
          this.container.logger.info(res);
        });
    }
  }
}
