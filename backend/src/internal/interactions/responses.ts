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

import { container } from "@sapphire/framework";
import { ColorResolvable, CommandInteraction, Message, MessageActionRow, MessageButton } from "discord.js";
import { environment } from "../../config";
import { BrandingColors } from "../constants/colors";
import { codeBlock } from "../functions/formatting";
import { BaseEmbed } from "../structures/Embed";

export const createEmbed = (description?: string, color: ColorResolvable = BrandingColors.Primary) => {
  return new BaseEmbed({ color, description }).setTimestamp();
};

/**
 * Sends an error response from an interaction.
 * @param interaction The interaction to send the response from.
 * @param description The description to send.
 * @param ephemeral Whether the response should be ephemeral.
 */
export const sendError = (interaction: CommandInteraction, description: string, ephemeral = true) => {
  // Core sapphire errors end in ".", so that needs to be accounted for.
  const parsedDescription = `❌ ${description.endsWith(".") ? description.slice(0, -1) : description}!`;

  const payload = {
    content: codeBlock(
      "css",
      `
     [Notice] - ${parsedDescription}
    `
    ),
    // embeds: [createEmbed(parsedDescription, BrandingColors.Error)],
    components: [
      new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel("Need help")
            .setEmoji("❓")
            .setStyle("LINK")
            .setURL(`${environment.bot.support_server_url}`)
        )
        .addComponents(
          new MessageButton()
            .setLabel("Report Bug")
            .setEmoji("🪲")
            .setStyle("LINK")
            .setURL(`${environment.bot.developerMetaData.bug_report_form}`)
        ),
    ],
    allowedMentions: { users: [interaction.user.id], roles: [] },
    ephemeral,
  };

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const replyFn = interaction.replied
    ? interaction.followUp
    : interaction.deferred
    ? interaction.editReply
    : interaction.reply;
  return replyFn.call(interaction, payload);
};

export const sendLegacyError = async (ctx: Message, description: string) => {
  // Core sapphire errors end in ".", so that needs to be accounted for.
  const parsedDescription = `❌ ${description.endsWith(".") ? description.slice(0, -1) : description}!`;

  const payload = {
    content: codeBlock(
      "css",
      `
     [Notice] - ${parsedDescription}
    `
    ),
    // embeds: [createEmbed(parsedDescription, BrandingColors.Error)],
    components: [
      new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel("Need help")
            .setEmoji("❓")
            .setStyle("LINK")
            .setURL(`${environment.bot.support_server_url}`)
        )
        .addComponents(
          new MessageButton()
            .setLabel("Report Bug")
            .setEmoji("🪲")
            .setStyle("LINK")
            .setURL(`${environment.bot.developerMetaData.bug_report_form}`)
        ),
    ],
    allowedMentions: { users: [ctx.author.id], roles: [] },
  };

  return await ctx.reply(payload)
};
