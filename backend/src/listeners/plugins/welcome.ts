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
import { GuildMember, TextChannel } from "discord.js";
import { WelcomePluginMongoModel } from "../../database/models/plugins/welcome/welcome";
import { memberMention } from "../../internal/functions/formatting";

@ApplyOptions<ListenerOptions>({
  event: Events.GuildMemberAdd,
})
export class UserEvent extends Listener {
  public async run(member: GuildMember): Promise<void> {
    const { client } = this.container;

    client.logger.trace(`[USER] ${member.user.tag} joined ${member.guild.name}`);

    const data = await WelcomePluginMongoModel.findOne({ GuildId: member.guild.id });

    if (!data || data.Enabled === false) return;

    client.logger.trace(`Found data!`)

    if (data.GuildWelcomeChannelId) {
      const welcomeChannel = client.channels.cache.get(data.GuildWelcomeChannelId) as TextChannel;
      if (!welcomeChannel) return;
      switch (data.GuildWelcomeTheme) {
        case "text":
          welcomeChannel.send({
            content: `${data
              .GuildWelcomeMessage!.replaceAll("{{user.mention}}", memberMention(member.id))
              .replaceAll("{{user.username}}", member.user.username)
              .replaceAll("{{user.id}}", member.id)
              .replaceAll("{{user.tag}}", member.user.tag)}`,
          });
          break;
        case "card":
          // TODO: Add card theme
          break;
        case "embed":
          // TODO: Add embed theme
          break;
        default:
          return;
      }
    }
  }
}
