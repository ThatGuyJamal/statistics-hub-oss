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
import { codeBlock } from "../../internal/functions/formatting";
import { pauseThread } from "../../internal/functions/promises";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";

@ApplyOptions<ICommandOptions>({
  description: "Allows the bot developers to check the cached data.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "",
    examples: [""],
    command_type: "message",
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message) {
    const { client } = this.container;

    client.guilds.fetch();

    const result = await ctx.channel.send({
      embeds: [
        {
          description: `Fetching cache...`,
        },
      ],
    });

    pauseThread(2, "seconds", "Cache Command");

    result.edit({
      embeds: [
        {
          description: codeBlock(
            "css",
            `===== Server Cache ====
_ Bot _
[Guilds]   = ${client.guilds.cache.size}
[Users]    = ${client.users.cache.size}
[Channels] = ${client.channels.cache.size}
[Emojis]   = ${client.emojis.cache.size}
            
_ Database _ 
[Mongodb] = ${client.LocalCacheStore.size}
[Redis]   = ${client.RedisController.keys.length}
            `
          ),
        },
      ],
    });
  }
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const { client } = this.container;

    client.guilds.fetch();

    const result = await interaction.reply({
      embeds: [
        {
          description: `Fetching cache...`,
        },
      ],
    });

    pauseThread(2, "seconds", "Cache Command");

    interaction.editReply({
      embeds: [
        {
          description: codeBlock(
            "css",
            `===== Internal Cache ====
                    
_ Bot _
[Guilds]   = ${client.guilds.cache.size}
[Users]    = ${client.users.cache.size}
[Channels] = ${client.channels.cache.size}
[Emojis]   = ${client.emojis.cache.size}
            
_ Databases _ 
[Mongodb] = ${client.LocalCacheStore.size}
[Redis]   = ${client.RedisController.keys.length}
            `
          ),
        },
      ],
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
