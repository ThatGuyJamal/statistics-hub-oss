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

import { DMChannel, TextChannel } from "discord.js";
import { TOptions } from "i18next";
import { editLocalized, fetchLanguage, resolveKey } from "@sapphire/plugin-i18next";
import { GuildMessage } from "../../types/discord";

export async function translate(x: TextChannel | DMChannel, path: string, _options?: TOptions): Promise<string> {
  return await resolveKey(x, path, _options);
}

export async function editTranslation(x: GuildMessage, path: string, _options: TOptions) {
  await editLocalized(x, path);
}

export async function fetchCurrentLanguage(x: TextChannel | GuildMessage): Promise<string> {
  return await fetchLanguage(x);
}
