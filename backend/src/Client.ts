/**
  Statistics Hub OSS - A data analytics discord bot.
    
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

import { environment } from "./config";
import { Logger, LoggerType } from "./utils/logger";
import { SlashCommand } from "./types/Command";
import { Bot, Collection, createBot, InteractionResponseTypes } from "./deps";

/**
 * Extended Bot Types
 */
export interface BotClientType extends Bot {
  /**
   * The commands that the bot has loaded.
   * A custom cache to access the commands.
   * TODO - Add typings for the command object.
   */
  slashCommands: Collection<string, SlashCommand>;
  logger: LoggerType;
}

export const Client = createBot({
  token: environment.bot.token,
  intents: ["Guilds"],
  botId: BigInt("946398697254703174"),
  events: {
    ready(_client, payload) {
      Logger.success(`Successfully connected Shard ${payload.shardId} to the gateway`);
    },

    async interactionCreate(client, interaction) {
      if (interaction.data?.name === "ping") {
        return await client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: { content: "🏓 Pong!" },
        });
      }

      return;
    },
  },
}) as BotClientType;

Client.slashCommands = new Collection();
Client.logger = Logger;
