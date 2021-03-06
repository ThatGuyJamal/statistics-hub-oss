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
import stripIndent, { createHyperLink } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";
import { BaseEmbed } from "../../internal/structures/Embed";

@ApplyOptions<ICommandOptions>({
  name: "invite",
  description: "Allows users to add the bot to new servers.",
  cooldownDelay: seconds(30),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: ["GUILD_TEXT"],
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "invite",
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message) {
    return await ctx.reply({
      embeds: [
        new BaseEmbed().contextEmbed(
          {
            description: stripIndent(`
                    === Invite Link ===
                    ${createHyperLink("Click Here", environment.bot.bot_oauth_url)} to invite the bot to your server.
                    `),
          },
          ctx
        ),
      ],
    });
  }
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    return await interaction.reply({
      embeds: [
        new BaseEmbed().interactionEmbed(
          {
            description: stripIndent(`
                    === Invite Link ===
                    ${createHyperLink("Click Here", environment.bot.bot_oauth_url)} to invite the bot to your server.
                    `),
          },
          interaction
        ),
      ],
      ephemeral: true,
    });
  }
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: getTestGuilds(),
      registerCommandIfMissing: environment.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: [],
    });
  }
}

@ApplyOptions<ICommandOptions>({
  name: "support",
  description: "Sends helpful links to the user.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "support",
    command_type: "both",
  },
})
export class UserCommand2 extends ICommand {
  public async messageRun(ctx: Message) {
    return await ctx.reply({
      embeds: [
        new BaseEmbed().contextEmbed(
          {
            description: stripIndent(`
                    === Support Information ===
                    ${createHyperLink("Server", environment.bot.support_server_url)} to join the support server.
                    ${createHyperLink(
                      "Documentation",
                      environment.bot.developerMetaData.documentation_link
                    )} to view the documentation.
                    ${createHyperLink(
                      "Dashboard",
                      environment.bot.developerMetaData.dashboard_link
                    )} to view the dashboard.
                    `),
          },
          ctx
        ),
      ],
    });
  }
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    return await interaction.reply({
      embeds: [
        new BaseEmbed().interactionEmbed(
          {
            description: stripIndent(`
                    === Support Information ===
                    ${createHyperLink("Server", environment.bot.support_server_url)}) to join the support server.
                    ${createHyperLink(
                      "Documentation",
                      environment.bot.developerMetaData.documentation_link
                    )} to view the documentation.
                    ${createHyperLink(
                      "Dashboard",
                      environment.bot.developerMetaData.dashboard_link
                    )} to view the dashboard.
                    `),
          },
          interaction
        ),
      ],
      ephemeral: true,
    });
  }
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: environment.bot.register_global_commands ? undefined : getTestGuilds(),
      registerCommandIfMissing: environment.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: [],
    });
  }
}
