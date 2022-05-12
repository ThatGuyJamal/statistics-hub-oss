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
import type { GuildMember, User } from "discord.js";

export function isAdmin(member: GuildMember): boolean {
  return member.permissions.has("ADMINISTRATOR") || member.permissions.has("MANAGE_GUILD");
}

export function isModerator(member: GuildMember): boolean {
  return isAdmin(member) || Boolean(member.roles.cache.find((r) => r.name.toLowerCase().includes("moderator")));
}

export function isGuildOwner(member: GuildMember): boolean {
  return member.id === member.guild.ownerId;
}

export function isOwner(user: User): boolean {
  return container.client.BotDevelopers.has(user.id);
}
