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
  EmbedField,
  Guild,
  MessageAttachment,
  MessageEmbed,
  MessageEmbedFooter,
  MessageEmbedImage,
  User,
} from "discord.js";
import minIndent from "min-indent";

/**
 * Format a username for bot members
 * @param author
 * @returns
 */
export function formatAuthor(author: User): string {
  return `${author.tag}${author.bot ? " [BOT]" : ""}`;
}

export function formatContent(guild: Guild, content: string): string {
  return cleanMentions(guild, content)
    .split("\n")
    .map((line: any) => `> ${line}`)
    .join("\n");
}

export function formatAttachment(attachment: MessageAttachment): string {
  return `📂 [${attachment.name}: ${attachment.url}]`;
}

/**
 * Formats the embed based on type
 * @param guild Guild Object
 * @param embed Embed Object
 * @returns {string} The formatted text
 */
export function formatEmbed(guild: Guild, embed: MessageEmbed): string {
  switch (embed.type) {
    case "video":
      return formatEmbedVideo(embed);
    case "image":
      return formatEmbedImage(embed);
    default:
      return formatEmbedRich(guild, embed);
  }
}

function formatEmbedVideo(embed: MessageEmbed): string {
  return `📹 [${embed.url}]${embed.provider ? ` (${embed.provider.name}).` : ""}`;
}

function formatEmbedImage(embed: MessageEmbed): string {
  return `🖼️ [${embed.url}]${embed.provider ? ` (${embed.provider.name}).` : ""}`;
}

function formatEmbedRich(guild: Guild, embed: MessageEmbed): string {
  if (embed.provider === null) {
    const output: string[] = [];
    if (embed.title) output.push(formatEmbedRichTitle(embed.title));
    if (embed.author) output.push(formatEmbedRichAuthor(embed.author));
    if (embed.url) output.push(formatEmbedRichUrl(embed.url));
    if (embed.description) output.push(formatEmbedRichDescription(guild, embed.description));
    if (embed.fields.length > 0)
      output.push(embed.fields.map((field) => formatEmbedRichField(guild, field)).join("\n"));
    if (embed.image) output.push(formatEmbedRichImage(embed.image));
    if (embed.footer) output.push(formatEmbedRichFooter(embed.footer));
    return output.join("\n");
  }

  return formatEmbedRichProvider(embed);
}

function formatEmbedRichTitle(title: string): string {
  return `># ${title}`;
}

function formatEmbedRichUrl(url: string): string {
  return `> 📎 ${url}`;
}

function formatEmbedRichAuthor(author: Exclude<MessageEmbed["author"], null>): string {
  return `> 👤 ${author.iconURL ? `[${author.iconURL}] ` : ""}${author.name || "-"}${
    author.url ? ` <${author.url}>` : ""
  }`;
}

function formatEmbedRichDescription(guild: Guild, description: string): string {
  return cleanMentions(guild, description)
    .split("\n")
    .map((line: any) => `> > ${line}`)
    .join("\n");
}

function formatEmbedRichField(guild: Guild, field: EmbedField): string {
  return `> #> ${field.name}\n${cleanMentions(guild, field.value)
    .split("\n")
    .map((line: any) => `>  > ${line}`)
    .join("\n")}`;
}

function formatEmbedRichImage(image: MessageEmbedImage): string {
  return `>🖼️ [${image.url}]`;
}

function formatEmbedRichFooter(footer: MessageEmbedFooter): string {
  return `>_ ${footer.iconURL ? `[${footer.iconURL}]${footer.text ? " - " : ""}` : ""}${footer.text ?? ""}`;
}

function formatEmbedRichProvider(embed: MessageEmbed): string {
  return `🔖 [${embed.url}]${embed.provider ? ` (${embed.provider.name}).` : ""}`;
}

/**
 * Allows for easy string indenting
 * @param str String to indent
 * @returns {string} The indented string
 */
export default function stripIndent(str: string) {
  const indent = minIndent(str);

  if (indent === 0) {
    return str;
  }

  const regex = new RegExp(`^[ \\t]{${indent}}`, "gm");

  return str.replace(regex, "");
}

/**
 * Wraps the content inside a codeblock with the specified language
 * @param language The language for the codeblock
 * @param code The code to wrap
 * @returns The codeblock
 */
export function codeBlock(
  language:
    | "asciidoc"
    | "autohotkey"
    | "bash"
    | "coffeescript"
    | "cpp"
    | "cs"
    | "css"
    | "diff"
    | "fix"
    | "glsl"
    | "ini"
    | "json"
    | "md"
    | "ml"
    | "prolog"
    | "py"
    | "tex"
    | "xl"
    | "js"
    | "ts"
    | "xml",
  code: string
) {
  return `\`\`\`${language}\n${stripIndent(code)}\`\`\``;
}

/**
 * Wraps the content inside \`backtick's\`, which formats it as inline code
 *
 * @param content The content to wrap
 */
export function inlineCode<C extends string>(content: C): `\`${C}\`` {
  return `\`${content}\``;
}
/**
 * Clean all mentions from a body of text
 * @param guild The guild for context
 * @param input The input to clean
 * @returns The input cleaned of mentions
 * @license Apache-2.0
 * @copyright 2019 Antonio Román
 */
export function cleanMentions(guild: Guild, input: string) {
  return input
    .replace(/@(here|everyone)/g, `@${ZeroWidthSpace}$1`)
    .replace(/<(@[!&]?|#)(\d{17,19})>/g, (match, type, id) => {
      switch (type) {
        case "@":
        case "@!": {
          const tag = guild.client.users.cache.get(id);
          return tag ? `@${tag.username}` : `<${type}${ZeroWidthSpace}${id}>`;
        }
        case "@&": {
          const role = guild.roles.cache.get(id);
          return role ? `@${role.name}` : match;
        }
        case "#": {
          const channel = guild.channels.cache.get(id);
          return channel ? `#${channel.name}` : `<${type}${ZeroWidthSpace}${id}>`;
        }
        default:
          return `<${type}${ZeroWidthSpace}${id}>`;
      }
    });
}
export const ZeroWidthSpace = "\u200B";
export const LongWidthSpace = "\u3000";
export const anyMentionRegExp = /<(@[!&]?|#)(\d{17,19})>/g;
export function capitalizeFirstLetter(word: string) {
  return word[0].toUpperCase() + word.slice(1);
}
/**
 * An enum with all the available faces from Discord's native slash commands
 */
export enum Faces {
  /**
   * ¯\\_(ツ)\\_/¯
   */
  Shrug = "¯\\_(ツ)\\_/¯",
  /**
   * (╯°□°）╯︵ ┻━┻
   */
  Tableflip = "(╯°□°）╯︵ ┻━┻",
  /**
   * ┬─┬ ノ( ゜-゜ノ)
   */
  Unflip = "┬─┬ ノ( ゜-゜ノ)",
}
/**
 * A markdown function to make hyperlinks in an embed message
 * @param name  The name of the link
 * @param url  The url of the link
 * @returns
 */
export function createHyperLink(name: string, url: string): string {
  return `[${name}](${url})`;
}
/**
 * Wraps a url in <> tags. This prevents it from embedding in a discord channel.
 * @param url The url to wrap
 * @returns
 */
export function hideLinkEmbed(url: string): string {
  return `<${url}>`;
}
/**
 * Formats a string to create a discord channel mention
 * @param id The id of the channel
 * @returns
 */
export function channelMention(id: string): string {
  if (id) {
    return `<#${id}>`;
  } else {
    return "".replaceAll("<#>", "No Channel");
  }
}
