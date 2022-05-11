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
import { Args, BucketScope } from "@sapphire/framework";
import { Message, TextChannel } from "discord.js";
import { ICommandOptions, ICommand } from "../../../Command";
import { GuildsMongoModel } from "../../../database/models/guild";
import { seconds } from "../../../internal/functions/time";
import { BaseEmbed } from "../../../internal/structures/Embed";

@ApplyOptions<ICommandOptions>({
  name: "view-config",
  aliases: ["view-configuration", "view-settings", "viewcs"],
  description: "Shows the current active configuration for the bot.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    command_type: "message",
  },
  requiredUserPermissions: ["MANAGE_GUILD"],
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message) {
    const settings = await GuildsMongoModel.findOne({ GuildId: ctx.guildId });

    if (!settings) {
      return ctx.reply({
        content: await this.translate(ctx.channel as TextChannel, "commands/config:view_config_command.no_settings"),
      });
    }

    return ctx.reply({
      embeds: [
        new BaseEmbed().contextEmbed(
          {
            description: await this.translate(
              ctx.channel as TextChannel,
              "commands/config:view_config_command.success",
              {
                prefix: settings.GuildPrefix || this.container.client.environment.bot.bot_prefix,
                language: settings.GuildLanguage || this.container.client.environment.bot.bot_language,
              }
            ),
          },
          ctx
        ),
      ],
    });
  }
}
