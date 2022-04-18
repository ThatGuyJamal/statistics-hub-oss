import type { Message } from "discord.js";
import { DMMessage, GuildMessage } from "../../types/discord";

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
