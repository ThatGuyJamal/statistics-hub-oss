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
import { send } from "@sapphire/plugin-editable-commands";
import { CommandInteraction, Message, TextChannel } from "discord.js";
import ms from "ms";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { codeBlock } from "../../internal/functions/formatting";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";

@ApplyOptions<ICommandOptions>({
  description: "Replies with the bots API latency.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message) {
    const msg = await send(
      ctx,
      `${await this.translate(ctx.channel as TextChannel, "commands/general:ping_command.reply_one")}`
    );

    const result = codeBlock(
      "diff",
      `+ ${await this.translate(ctx.channel as TextChannel, "commands/general:ping_command.reply_two", {
        replace: {
          APILatency: `${ms(
            (msg.editedTimestamp || msg.createdTimestamp) - (ctx.editedTimestamp || ctx.createdTimestamp)
          )}`,
          wsLatency: `${ms(Math.round(this.container.client.ws.ping))}`,
          uptime: `${ms(this.container.client.uptime || 0)}`,
        },
      })}
    `
    );

    return await msg.edit({
      content: result,
    });
  }

  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const result = codeBlock(
      "diff",
      `- Pong! My websocket connection took... ${ms(Math.round(this.container.client.ws.ping))} to respond.`
    );

    const msg = (await interaction.reply({
      content: `Ping?`,
      ephemeral: true,
      fetchReply: true,
    })) as Message;

    const { diff, ping } = this.getPing(msg, interaction);

    return interaction.editReply({
      content: `Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ms(ping)})`,
    });
  }

  /**
   * @param message The message to get the ping from.
   * @param interaction The interaction that triggered the command.
   * @returns {diff: number, ping: number} The ping and the roundtrip time.
   */
  private getPing(message: Message, interaction: CommandInteraction) {
    const diff = (message.editedTimestamp || message.createdTimestamp) - interaction.createdTimestamp;
    const ping = Math.round(this.container.client.ws.ping);

    return { diff, ping };
  }

  /**
   * @param registry The registry to register the command to.
   */
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: getTestGuilds(),
      registerCommandIfMissing: environment.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: ["973000992989802587"],
    });
  }
}
