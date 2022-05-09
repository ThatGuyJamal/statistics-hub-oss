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

import { MessageEmbed, MessageEmbedOptions, CommandInteraction, Message } from "discord.js";
import { environment } from "../../config";
import { BrandingColors } from "../constants/colors";

/**
 * Utility class for creating embeds.
 */
export class BaseEmbed extends MessageEmbed {
  /**
   * Function to quickly make message embeds
   * @param {MessageEmbedOptions} data Discord MessageEmbedOptions type
   * @param {CommandInteraction} interaction Discord-x CommandInteraction type
   */
  public interactionEmbed(data: MessageEmbedOptions, interaction: CommandInteraction): BaseEmbed {
    return new BaseEmbed({
      ...data,
      color: BrandingColors.Primary,
      footer: {
        text: `📈 ${environment.bot.bot_name}`,
        iconURL: interaction.user.displayAvatarURL({
          dynamic: true,
          format: "png",
        }),
      },
      author: {
        name: `${interaction.user.username} | 🥀`,
        url: environment.bot.support_server_url,
        iconURL: interaction.user.displayAvatarURL({
          dynamic: true,
          format: "png",
        }),
      },
    });
  }

  /**
   * Function to quickly make message embeds (legacy command support)
   * @param {MessageEmbedOptions} data Discord MessageEmbedOptions type
   * @param {Message} message Discord Message type
   * @returns
   */
  public contextEmbed(data: MessageEmbedOptions, ctx: Message): BaseEmbed {
    return new BaseEmbed({
      ...data,
      color: BrandingColors.Secondary,
      footer: {
        text: `✅ Try out slash commands!`,
        iconURL: ctx.author.displayAvatarURL({
          dynamic: true,
          format: "png",
        }),
      },
      timestamp: Date.now(),
      author: {
        name: `${ctx.author.username} | 🤍`,
        url: environment.bot.support_server_url,
        iconURL: ctx.author.displayAvatarURL({
          dynamic: true,
          format: "png",
        }),
      },
    });
  }
}
