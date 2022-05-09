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

import { environment } from "../config";

const testGuilds = environment.bot.test_guild_ids;

/**
 * A more programmatic way to get all development guilds for the bot.
 * @returns {string[]}
 */
export function getTestGuilds(): string[] {
  const arr: string[] = [];

  for (const guild of testGuilds) {
    arr.push(guild);
  }

  return arr;
}
