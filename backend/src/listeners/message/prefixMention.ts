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
import { environment } from "../../config";
import { isPrivateMessage } from "../../internal/functions/guards";
import { translate } from "../../internal/il8n";

@ApplyOptions<ListenerOptions>({
  event: Events.MentionPrefixOnly,
})
export class UserEvent extends Listener {
  public async run(ctx: Message) {
    let _prefix = this.container.client.LocalCacheStore.memory.guild.get(ctx.guild!)?.GuildPrefix;
    if (!_prefix) _prefix = environment.bot.bot_prefix;

    if (!isPrivateMessage(ctx)) {
      await ctx.reply({
        content: await translate(ctx.channel as DMChannel, "events/message:prefix_mention.reply_guild", {
          prefix: _prefix,
        }),
        allowedMentions: {
          users: [ctx.author.id],
        },
      });
    } else {
      await ctx.reply({
        content: await translate(ctx.channel, "events/message:prefix_mention.reply_dm", {
          default_prefix: environment.bot.bot_prefix,
        }),
        allowedMentions: {
          users: [ctx.author.id],
        },
      });
    }
  }
}
