import { MessageEmbed, MessageEmbedOptions, CommandInteraction, Message } from "discord.js";
import { ENV } from "../../config";
import { BrandingColors } from "./colors";

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
        text: `📈 ${ENV.bot.name}`,
        iconURL: interaction.user.displayAvatarURL({
          dynamic: true,
          format: "png",
        }),
      },
      author: {
        name: `${interaction.user.username} | 🥀`,
        url: ENV.bot.server_link,
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
        url: ENV.bot.server_link,
        iconURL: ctx.author.displayAvatarURL({
          dynamic: true,
          format: "png",
        }),
      },
    });
  }
}
