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
import { Message, DMChannel } from "discord.js";
import { ENV } from "../../config";
import { translate } from "../../lib/il8n/translate";
import { isPrivateMessage } from "../../lib/utils/guards";

@ApplyOptions<ListenerOptions>({
  event: Events.MentionPrefixOnly,
})
export class UserEvent extends Listener {
  public async run(ctx: Message) {
    const _prefix = this.container.client.GuildSettingsModel._cache.get(ctx.guild!.id)?.prefix;
    if (!isPrivateMessage(ctx)) {
      await ctx.channel.send({
        content: await translate(ctx.channel as DMChannel, "events/errors:prefix_mention_reply_guild", {
          prefix: _prefix ?? ENV.bot.prefix,
          server_invite: ENV.bot.server_link,
        }),
      });
    } else {
      await ctx.channel.send({
        content: await translate(ctx.channel, "events/errors:prefix_mention_reply_dm", {
          prefix: _prefix ?? ENV.bot.prefix,
          server_invite: ENV.bot.server_link,
        }),
      });
    }
  }
}
