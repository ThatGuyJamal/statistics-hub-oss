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
import { ApplicationCommandRegistry, BucketScope, ChatInputCommand, RegisterBehavior } from "@sapphire/framework";
import { send } from "@sapphire/plugin-editable-commands";
import { Message, TextChannel } from "discord.js";
import ms from "ms";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { BrandingColors } from "../../lib/utils/colors";
import { codeBlock, inlineCode } from "../../lib/utils/format";
import { pauseThread } from "../../lib/utils/promises";
import { createEmbed } from "../../lib/utils/responses";
import { seconds } from "../../lib/utils/time";
import { getTestGuilds } from "../../lib/utils/utils";

@ApplyOptions<ICommandOptions>({
  aliases: ["pong", "latency"],
  description: "Check the bot latency with discords api.",
  detailedDescription: "Returns helpful and quick statistics on the bot latency and uptime.",
  cooldownDelay: seconds(5),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: ["GUILD_TEXT", "DM"],
  nsfw: false,
  enabled: true,
  extendedDescription: {
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  public override async messageRun(ctx: Message) {
    const msg = await send(ctx, "fetching current latency...");

    const result = codeBlock(
      "diff",
      `
      + ${await this.translate(ctx.channel as TextChannel, "commands/miscellaneous:ping_command.description", {
        replace: {
          APILatency: `${ms(
            (msg.editedTimestamp || msg.createdTimestamp) - (ctx.editedTimestamp || ctx.createdTimestamp)
          )}`,
          wsLatency: `${ms(Math.round(this.container.client.ws.ping))}`,
        },
      })}
    `
    );

    return await msg.edit({
      content: result,
    });
  }

  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    await interaction.deferReply();

    await pauseThread(2000, "seconds");

    return await interaction.editReply({
      content: `***Pong!** My websocket connection took... \`${ms(
        Math.round(this.container.client.ws.ping)
      )}\` to respond.`,
    });
  }

  /**
   * Uploads our data to discord, and creates a slash command.
   * @param registry
   */
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {
        guildIds: getTestGuilds(),
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["964164545482473582"],
      }
    );
  }
}
