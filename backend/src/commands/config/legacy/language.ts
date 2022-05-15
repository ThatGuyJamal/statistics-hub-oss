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

import { ApplyOptions } from "@sapphire/decorators";
import { Args, BucketScope } from "@sapphire/framework";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../../Command";
import { GuildsMongoModel, supportedLanguagesArray } from "../../../database/models/guild";
import { codeBlock } from "../../../internal/functions/formatting";
import { seconds } from "../../../internal/functions/time";
import { BaseEmbed } from "../../../internal/structures/Embed";

const langsWeCanUse = supportedLanguagesArray;

@ApplyOptions<ICommandOptions>({
  description: "Configure the bot's language settings.",
  aliases: ["lang", "setlang", "slang", "language"],
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 1,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "language <option>",
    examples: ["language es-ES", "language en-US"],
    command_type: "message",
  },
  requiredUserPermissions: ["MANAGE_GUILD"],
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    const { client } = this.container;

    const languageArgument = await args.pick("string").catch(() => null);

    if (!languageArgument) {
      return await ctx.reply({
        content: `No arguments were provided.`,
        embeds: [
          new BaseEmbed().contextEmbed({
            description: `The current language is set to **${client.LocalCacheStore.memory.guild.get(ctx.guild!)?.GuildLanguage}**.`,
          }, ctx).addField("Valid Languages", langsWeCanUse.map((lang) => codeBlock("css", `
          [${lang.name}](${lang.code})
          `)).join("\n")).addField("Usage", `\`language <language code>\` or \`language reset\``)
        ]
      })
    }

    const cachedLanguage = client.LocalCacheStore.memory.guild.get(ctx.guild!);
    const document = await GuildsMongoModel.findOne({ GuildID: ctx.guildId });


    if (languageArgument.toLowerCase() === "reset") {
      if (!cachedLanguage) {
        client.LocalCacheStore.memory.guild.set(ctx.guild!, {
          GuildId: ctx.guildId!,
          GuildName: ctx.guild!.name,
          GuildPrefix: undefined,
          GuildLanguage: "en-US",
          CreatedAt: new Date(),
        })
      } else {
        client.LocalCacheStore.memory.guild.set(ctx.guild!, {
          ...cachedLanguage,
          CreatedAt: new Date(),
          GuildLanguage: "en-US",
        })
      }
      if (!document) {
        await GuildsMongoModel.create({
          GuildID: ctx.guildId,
          GuildName: ctx.guild!.name,
          GuildLanguage: "en-US",
        });
      } else {
        await document.updateOne({
          $set: {
            GuildLanguage: "en-US",
          },
        });
      }

      return await ctx.reply({
        content: `The language has been reset to **en-US**.`,
      });
    } else {
      // Check if the language argument is a valid language code.
      const language = langsWeCanUse.find((lang) => lang.code === languageArgument);

      if(!language) {
        return await ctx.reply({
          content: `The language code provided is not valid.`,
          embeds: [
            new BaseEmbed().contextEmbed({
              description: `The current language is set to **${client.LocalCacheStore.memory.guild.get(ctx.guild!)?.GuildLanguage}**.`,
            }, ctx).addField("Valid Languages", langsWeCanUse.map((lang) => codeBlock("css", `
          [${lang.name}](${lang.code})
          `)).join("\n")).addField("Usage", `\`language <language code>\` or \`language reset\``)
          ]
        })
      }

      if (!cachedLanguage) {
        client.LocalCacheStore.memory.guild.set(ctx.guild!, {
          GuildId: ctx.guildId!,
          GuildName: ctx.guild!.name,
          GuildPrefix: undefined,
          GuildLanguage: language.code,
          CreatedAt: new Date(),
        })
      }

      if (!document) {
        await GuildsMongoModel.create({
          GuildID: ctx.guildId,
          GuildName: ctx.guild!.name,
          GuildLanguage: language.code,
        });
      }

      await document?.updateOne({
        $set: {
          GuildLanguage: language.code,
        },
      });

      return await ctx.reply({
        content: `The language has been set to **${language.name} (${language.code})**.`,
      });
    }
  }
}
