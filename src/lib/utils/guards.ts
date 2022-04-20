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

import { Message } from "discord.js";
import { DMMessage, GuildMessage } from "../../types/discord";
import type { APIMessage } from "discord-api-types/v9";

/**
 * Checks whether a message was sent in a guild.
 * @param message The message to check.
 * @returns Whether the message was sent in a guild.
 */
export function isGuildMessage(message: Message): message is GuildMessage {
  return message.guild !== null;
}

/**
 * Checks whether a message was sent in a DM channel.
 * @param message The message to check.
 * @returns Whether the message was sent in a DM channel.
 */
export function isPrivateMessage(message: Message): message is DMMessage {
  return message.guild === null;
}

/**
 * Checks whether a given message is an instance of {@link Message}, and not {@link APIMessage}
 * @param message The message to check
 * @returns `true` if the message is an instance of `Message`, false otherwise.
 */
export function isMessageInstance(message: APIMessage | Message): message is Message {
  return message instanceof Message;
}
