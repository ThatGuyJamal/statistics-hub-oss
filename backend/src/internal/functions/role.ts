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

import { type GuildMember, Interaction, Message, type Role } from "discord.js";

/**
 * Checks if we have permissions to manage this role.
 * If we dont, the discord API will throw an error.
 * @param role The role to check.
 * @param context The message or interaction that triggered the command.
 * @returns {boolean} Whether or not we have permissions to manage this role.
 */
export function isRoleManageable(role: Role, context: Message | Interaction): boolean {
  if (role.managed) return false;

  // If we arent in a guild, we can't manage roles. We can't do anything.
  if (!context.guild) return false;

  // Checks if the role is above the bots highest role.
  if (context instanceof Message) {
    if (role.position > (context.guild.me as GuildMember).roles.highest.position) return false;
  } else if (context instanceof Interaction) {
    if (role.position > (context.guild.me as GuildMember).roles.highest.position) return false;
  }

  return true;
}
