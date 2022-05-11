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

import { Listener, Events, ChatInputCommandErrorPayload, UserError } from "@sapphire/framework";
import { TextChannel } from "discord.js";
import { bold, redBright } from "colorette";
import { translate } from "../../internal/il8n";
import { sendError } from "../../internal/interactions/responses";
import { BaseEmbed } from "../../internal/structures/Embed";
import { environment } from "../../config";

export class UserListener extends Listener<typeof Events.ChatInputCommandError> {
  public async run(error: Error, { command, interaction }: ChatInputCommandErrorPayload) {
    if (error instanceof UserError) {
      return sendError(interaction, error.message);
    }

    this.container.logger.fatal(`${redBright(bold(`[/${command.name}]`))} ${error.stack || error.message}`);

    let logChannel = this.container.client.channels.cache.get(environment.bot.channels.command_channel) as TextChannel;
    if (logChannel) {
      await logChannel.send({
        content: `${redBright(bold(`[/${command.name}]`))} ${error.stack || error.message}`,
        embeds: [
          new BaseEmbed().interactionEmbed(
            {
              title: await translate(
                interaction.channel as TextChannel,
                "events/errors:command_input_error_event_embed_titles"
              ),
              description: await translate(
                interaction.channel as TextChannel,
                "events/errors:command_input_error_event_embed_descriptions"
              ),
              fields: [
                {
                  name: "Command",
                  value: `${command.name}`,
                  inline: true,
                },
                {
                  name: "Error",
                  value: `${error.stack || error.message}`,
                  inline: true,
                },
              ],
              color: "RED",
            },
            interaction
          ),
        ],
      });
    }

    return sendError(interaction, "Something went wrong");
  }
}
