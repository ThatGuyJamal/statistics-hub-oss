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
