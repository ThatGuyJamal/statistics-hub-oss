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

import {
  editLocalized,
  fetchLanguage,
  InternationalizationContext,
  InternationalizationOptions,
  resolveKey,
  TOptions,
} from "@sapphire/plugin-i18next";
import { TextChannel, DMChannel } from "discord.js";
import { GuildMessage } from "../../typings/discord-types";

export function parseInternationalizationOptions(): InternationalizationOptions {
  return {
    defaultName: "en-US",
    defaultMissingKey: "default:key_error",
    fetchLanguage: async (context: InternationalizationContext) => {
      if (!context.guild) return "en-US";
      else {
        return "en-US";
      }
    },
    i18next: (_: string[], languages: string[]) => ({
      supportedLngs: languages,
      preload: languages,
      returnObjects: true,
      returnEmptyString: false,
      returnNull: false,
      load: "all",
      lng: "en-US",
      fallbackLng: "en-US",
      defaultNS: "globals",
      overloadTranslationOptionHandler: (args: any[]): TOptions => ({
        defaultValue: args[1] ?? "globals:default",
      }),
      initImmediate: false,
    }),
  };
}
/**
 * Translates a key into the current language.
 * @param x The Discord.js TextChannel Object.
 * @param path The path to the key.
 * @param _options The options to pass to the translator.
 * @returns {string} The translated key.
 */
export async function translate(x: TextChannel | DMChannel, path: string, _options?: TOptions): Promise<string> {
  return await resolveKey(x, path, _options);
}

export async function editTranslation(x: GuildMessage, path: string, _options: TOptions) {
  await editLocalized(x, path);
}

export async function fetchCurrentLanguage(x: TextChannel | GuildMessage): Promise<string> {
  return await fetchLanguage(x);
}
