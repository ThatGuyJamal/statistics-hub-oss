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
import { drawCard, Text } from "discord-welcome-card";
import { GuildMember, TextChannel } from "discord.js";
import { Colors, colorToStyle } from "../../internal/constants/colors";
import { memberMention } from "../../internal/functions/formatting";

@ApplyOptions<ListenerOptions>({
  name: "welcome-plugin-add",
  event: Events.GuildMemberAdd,
})
export class UserEvent extends Listener {
  public async run(member: GuildMember): Promise<void> {
    const { client } = this.container;

    const data = client.LocalCacheStore.memory.plugins.welcome.get(member.guild);

    if (!data || data.Enabled === false) return;

    if (data.GuildWelcomeChannelId) {
      const welcomeChannel = client.channels.cache.get(data.GuildWelcomeChannelId) as TextChannel;
      if (!welcomeChannel) return;
      switch (data.GuildWelcomeTheme) {
        case "text":
          welcomeChannel
            .send({
              content: `${data
                .GuildWelcomeMessage!.replaceAll("{{user.mention}}", memberMention(member.id))
                .replaceAll("{{user.username}}", member.user.username)
                .replaceAll("{{user.id}}", member.id)
                .replaceAll("{{user.tag}}", member.user.tag)
                .replaceAll("{{server.memberCount}}", member.guild.memberCount.toString())
                .replaceAll("{{server.name}}", member.guild.name)
                .replaceAll("{{server.id}}", member.guild.id)}`,
            })
            .catch(() => {});
          break;
        case "card":
          const image = await drawCard({
            theme: "circuit",
            text: {
              title: new Text("Welcome!", 240, 70).setFontSize(32),
              text: new Text(member.user.tag, 240, 150).setFontSize(34),
              subtitle: `We now have {{server.memberCount}} members!`.replaceAll(
                "{{server.memberCount}}",
                member.guild.memberCount.toString()
              ),
              color: `#DDDDDD`,
              font: "Panton Black Caps",
            },
            avatar: {
              image: member.user.displayAvatarURL({ format: "png" }),
              outlineWidth: 5,
              outlineColor: colorToStyle(Colors.Amber),
              borderRadius: 1,
            },
            card: {
              background: data.GuildWelcomeThemeUrl,
              blur: 1,
              border: true,
              rounded: true,
            },
          });
          welcomeChannel
            .send({
              content: data.GuildWelcomePingOnJoin ? `${memberMention(member.id)}` : null,
              files: [image],
            })
            .catch(() => {});
          break;
        case "embed":
          // TODO: Add embed theme
          break;
        default:
          // If no theme is set, use the text theme
          welcomeChannel
            .send({
              content: `${data
                .GuildWelcomeMessage!.replaceAll("{{user.mention}}", memberMention(member.id))
                .replaceAll("{{user.username}}", member.user.username)
                .replaceAll("{{user.id}}", member.id)
                .replaceAll("{{user.tag}}", member.user.tag)
                .replaceAll("{{server.id}}", member.guild.id)}`,
            })
            .catch(() => {});
          break;
      }
    }
  }
}

@ApplyOptions<ListenerOptions>({
  name: "welcome-plugin-remove",
  event: Events.GuildMemberRemove,
})
export class UserEvent2 extends Listener {
  public async run(member: GuildMember): Promise<void> {
    const { client } = this.container;

    const data = client.LocalCacheStore.memory.plugins.welcome.get(member.guild);

    if (!data || data.Enabled === false) return;

    if (data.GuildGoodbyeChannelId) {
      const goodbyeChannel = client.channels.cache.get(data.GuildGoodbyeChannelId) as TextChannel;
      if (!goodbyeChannel) return;
      switch (data.GuildWelcomeTheme) {
        case "text":
          goodbyeChannel.send({
            content: `${data
              .GuildGoodbyeMessage!.replaceAll("{{user.mention}}", memberMention(member.id))
              .replaceAll("{{user.username}}", member.user.username)
              .replaceAll("{{user.id}}", member.id)
              .replaceAll("{{user.tag}}", member.user.tag)
              .replaceAll("{{server.memberCount}}", member.guild.memberCount.toString())
              .replaceAll("{{server.name}}", member.guild.name)
              .replaceAll("{{server.id}}", member.guild.id)}`,
          });
          break;
        case "card":
          const image = await drawCard({
            theme: "circuit",
            text: {
              title: new Text("Goodbye!", 240, 70).setFontSize(32),
              text: new Text(member.user.tag, 240, 150).setFontSize(34),
              subtitle: `We now have {{server.memberCount}} members!`.replaceAll(
                "{{server.memberCount}}",
                member.guild.memberCount.toString()
              ),
              color: `#DDDDDD`,
              font: "Panton Black Caps",
            },
            avatar: {
              image: member.user.displayAvatarURL({ format: "png" }),
              outlineWidth: 5,
              outlineColor: colorToStyle(Colors.Amber),
              borderRadius: 1,
            },
            card: {
              background: data.GuildWelcomeThemeUrl,
              blur: 1,
              border: true,
              rounded: true,
            },
          });
          goodbyeChannel
            .send({
              content: data.GuildWelcomePingOnJoin ? `${memberMention(member.id)}` : null,
              files: [image],
            })
            .catch(() => {});
          break;
        case "embed":
          // TODO: Add embed theme
          break;
        default:
          // If no theme is set, use the text theme
          goodbyeChannel.send({
            content: `${data
              .GuildWelcomeMessage!.replaceAll("{{user.mention}}", memberMention(member.id))
              .replaceAll("{{user.username}}", member.user.username)
              .replaceAll("{{user.id}}", member.id)
              .replaceAll("{{user.tag}}", member.user.tag)
              .replaceAll("{{server.id}}", member.guild.id)}`,
          });
          break;
      }
    }
  }
}
