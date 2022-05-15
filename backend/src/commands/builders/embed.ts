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
import { BucketScope, ApplicationCommandRegistry, RegisterBehavior, ChatInputCommand } from "@sapphire/framework";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";
import { BaseEmbed } from "../../internal/structures/Embed";

@ApplyOptions<ICommandOptions>({
  aliases: ["create-embed"],
  description: "A simple way to build embeds in your server.",
  detailedDescription: "An Rich Embed builder for your sever. Fully customizable by slash commands.",
  cooldownDelay: seconds(15),
  cooldownScope: BucketScope.User,
  cooldownLimit: 1,
  runIn: ["GUILD_TEXT", "GUILD_NEWS"],
  nsfw: false,
  enabled: true,
  extendedDescription: {
    command_type: "slash",
  },
  requiredUserPermissions: ["MANAGE_MESSAGES"],
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message) {
    return ctx.reply("This command is only available in slash command form.");
  }
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {

    const titleArgument = interaction.options.getString("title", false)
    const descriptionArgument = interaction.options.getString("description", false)
    const colorArgument = interaction.options.getString("color", false)
    const thumbnailArgument = interaction.options.getString("thumbnail", false)
    const imageArgument = interaction.options.getString("image", false)
    const authorNameArgument = interaction.options.getString("author", false)
    const authorIconArgument = interaction.options.getString("authorIcon", false)
    const authorUrlArgument = interaction.options.getString("authorUrl", false)
    const footerArgument = interaction.options.getString("footer", false)
    const footerIconArgument = interaction.options.getString("footerIcon", false)
    const timestampArgument = interaction.options.getBoolean("timestamp", false)
    const contentArgument = interaction.options.getString("content", false)

    await interaction.deferReply({
      ephemeral: true,
    })

    if (
      !titleArgument &&
      !descriptionArgument &&
      !colorArgument &&
      !thumbnailArgument &&
      !imageArgument &&
      !authorNameArgument &&
      !authorIconArgument &&
      !authorUrlArgument &&
      !footerArgument &&
      !timestampArgument
    ) {
      return await interaction.editReply({
        content: `No arguments passed for an embed to be built.`
      });
    }

    const embed = new BaseEmbed()

    if (titleArgument) {
      if (titleArgument.length > 256) return await interaction.followUp("The title is too long. Must be less than 256 characters.");
      embed.setTitle(titleArgument);
    }

    if (descriptionArgument) {
      if (descriptionArgument.length > 4096) return await interaction.followUp("Description is too long. Cant be over 2048 characters.");
      embed.setDescription(descriptionArgument);
    }

    if (colorArgument) {
      if(!colorArgument.match(/^#[0-9A-F]{6}$/i)) await interaction.followUp("Color must be a hex color code.");
      let convertedColor = parseInt(colorArgument.replace("#", ""), 16);
      console.log(convertedColor);
      embed.setColor(convertedColor);
    }

    if (thumbnailArgument) {
      if (!thumbnailArgument.startsWith("http" || "https")) return await interaction.followUp("Invalid thumbnail url. Must start with http or https.");
      embed.setThumbnail(thumbnailArgument);
    }

    if (imageArgument) {
      if (!imageArgument.startsWith("http" || "https")) return await interaction.followUp("Invalid image url. Must start with http or https.");
      embed.setImage(imageArgument);
    }

    if (authorNameArgument) {
      if (!descriptionArgument) await interaction.followUp("You can't have author without a description field.");
      if(authorNameArgument.length > 256) return await interaction.followUp("The author name is too long. Must be less than 256 characters.");
      embed.setAuthor({
        name: authorNameArgument,
        iconURL: authorIconArgument ?? undefined,
        url: authorUrlArgument ?? undefined,
      })
    }

    if (footerArgument) {
      if (footerArgument.length > 2048) return await interaction.followUp("The footer is too long. Must be less than 2048 characters.");
      embed.setFooter({
        text: footerArgument,
        iconURL: footerIconArgument ?? undefined,
      });
    }

    if (timestampArgument) {
      embed.setTimestamp();
    }

    await interaction.editReply({
      content: `Custom Embed created.`,
    });

    return await interaction.channel?.send({
      content: contentArgument ?? null,
      embeds: [embed],
    }).catch(() => {
      // this.container.client.logger.error(err);
      interaction.editReply({ content: `Failed to create embed.` })
    });

  }
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((builder) => builder.setName("title").setDescription("The title of the embed").setRequired(false))
          .addStringOption((builder) => builder.setName("description").setDescription("The description of the embed").setRequired(false))
          .addStringOption((builder) => builder.setName("url").setDescription("The url of the embed").setRequired(false))
          .addStringOption((builder) => builder.setName("color").setDescription("The color of the embed").setRequired(false))
          .addStringOption((builder) => builder.setName("footer").setDescription("The footer of the embed").setRequired(false))
          .addStringOption((builder) => builder.setName("footer-icon").setDescription("The icon for the footer of the embed.").setRequired(false))
          .addStringOption((builder) => builder.setName("author").setDescription("The author of the embed").setRequired(false))
          .addStringOption((builder) => builder.setName("author-icon").setDescription("The icon for the author of the embed").setRequired(false))
          .addStringOption((builder) => builder.setName("author-url").setDescription("The url for the author of the embed").setRequired(false))
          .addStringOption((builder) => builder.setName("thumbnail").setDescription("The thumbnail of the embed").setRequired(false))
          .addStringOption((builder) => builder.setName("image").setDescription("The image of the embed").setRequired(false))
          .addStringOption((builder) => builder.setName("content").setDescription("The content with the embed").setRequired(false))
          .addBooleanOption((builder) => builder.setName("timestamp").setDescription("If the embed should have a timestamp").setRequired(false))
      ,
      {
        guildIds: environment.bot.register_global_commands ? undefined : getTestGuilds(),
        registerCommandIfMissing: environment.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: [],
      }
    );
  }
}
