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

import { APIApplicationCommandOptionChoice } from "discord-api-types/v9";

// TODO replace this with this hardcoded list in the command file
export const welcomeCommandThemeURlChoices: APIApplicationCommandOptionChoice<string>[] = [
  {
    name: "Sunset forest Banner",
    value: "https://i.imgur.com/ea9PB3H.png",
  },
  {
    name: "Green Railroad",
    value: "https://i.imgur.com/dCS4tQk.jpeg",
  },
  {
    name: "Rain Drops",
    value: "https://i.imgur.com/ftY0903.jpeg",
  },
  {
    name: "Hidden Lighthouse",
    value: "https://cdn.discordapp.com/attachments/937124004492365874/968196852056997938/EpicBanner.png",
  },
  {
    name: "Warm sunset",
    value: "https://cdn.discordapp.com/attachments/937124004492365874/972560334965579886/Banner2.png",
  },
];

export const welcomeCommandThemeOptions: APIApplicationCommandOptionChoice<string>[] = [
  {
    name: "Text",
    value: "text",
  },
  {
    name: "Card",
    value: "card",
  },
];

export const welcomeCommandOptions: APIApplicationCommandOptionChoice<string>[] = [
  {
    name: "Greet Message",
    value: "GuildWelcomeMessage",
  },
  {
    name: "Goodbye Message",
    value: "GuildGoodbyeMessage",
  },
  {
    name: "Theme",
    value: "GuildWelcomeTheme",
  },
  {
    name: "Theme URL",
    value: "GuildWelcomeThemeUrl",
  },
  {
    name: "Ping on join",
    value: "GuildWelcomePingOnJoin",
  },
  {
    name: "Welcome Channel",
    value: "GuildWelcomeChannelId",
  },
  {
    name: "Goodbye Channel",
    value: "GuildGoodbyeChannelId",
  },
];
