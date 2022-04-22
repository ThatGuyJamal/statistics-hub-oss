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
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { seconds } from "../../lib/utils/time";
import { codeBlock } from "../../lib/utils/format";
import { pauseThread } from "../../lib/utils/promises";
import { DefaultDataModelObject } from "../../lib/database/";

@ApplyOptions<ICommandOptions>({
  description: "Checks the current active cache for this server",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  preconditions: ["OwnerOnly"],
  extendedDescription: {
    command_type: "slash",
  },
})
export class UserCommand extends ICommand {
  // Message Based Command
  public async messageRun(ctx: Message) {
    if (!ctx.guild) return;

    const msg = await ctx.reply({
      content: `Fetching data...`,
    });
    await pauseThread(3, "seconds", "Cache Command").then(async () => {
      const fetch = await this.container.client.GuildSettingsModel.getDocument(ctx.guild!);

      if (!fetch) {
        await this.container.client.GuildSettingsModel._model
          .create({
            _id: ctx.guild!.id,
            guild_name: ctx.guild!.name,
            data: DefaultDataModelObject,
          })
          .then((res) => {
            this.container.logger.info(res);
          });

        return ctx.reply({
          content: `No cache found. Creating new cache...`,
        });
      } else {
        const memData =
          //@ts-ignore
          fetch.data.member?.guildJoins + fetch.data.member?.guildLeaves + fetch.data.member?.guildBans ?? 0;
        //@ts-ignore
        const msgData = fetch.data.message ?? 0;
        //@ts-ignore
        const voiceData = fetch.data.voice ?? 0;
        //@ts-ignore
        const chanCreateData = fetch.data.channel?.created ?? 0;
        //@ts-ignore
        const chanDeleteData = fetch.data.channel?.deleted ?? 0;
        //@ts-ignore
        const memJoinData = fetch.data.member?.guildJoins ?? 0;
        //@ts-ignore
        const memLeaveData = fetch.data.member?.guildLeaves ?? 0;

        return await msg.edit({
          content: codeBlock(
            "css",
            `
            = = = Server Data = = =
            [Message Size] = ${msgData}
            [Member Join Size] = ${memJoinData}
            [Member Leave Size] = ${memLeaveData}
            [Voice Channels Joined] = ${voiceData}
            [Channels Create] = ${chanCreateData}
            [Channels Delete] = ${chanDeleteData}
 
            More stats coming soon...
 
            Total data size Cached = ${msgData! + memData + voiceData + chanCreateData + chanDeleteData}
             `
          ),
        });
      }
    });
  }
  // Slash Based Command
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    await interaction
      .reply({
        content: `Fetching data...`,
      })
      .then(async () => {
        await pauseThread(3, "seconds", "Cache Command").then(async () => {
          const fetch = await this.container.client.GuildSettingsModel.getDocument(interaction.guild!);

          if (!fetch) {
            await this.container.client.GuildSettingsModel._model
              .create({
                _id: interaction.guild!.id,
                guild_name: interaction.guild!.name,
                data: DefaultDataModelObject,
              })
              .then((res) => {
                this.container.logger.info(res);
              });

            return interaction.reply({
              content: `No cache found. Creating new cache...`,
            });
          } else {
            const memData =
              //@ts-ignore
              fetch.data.member?.guildJoins + fetch.data.member?.guildLeaves + fetch.data.member?.guildBans ?? 0;
            //@ts-ignore
            const msgData = fetch.data.message ?? 0;
            //@ts-ignore
            const voiceData = fetch.data.voice ?? 0;
            //@ts-ignore
            const chanCreateData = fetch.data.channel?.created ?? 0;
            //@ts-ignore
            const chanDeleteData = fetch.data.channel?.deleted ?? 0;
            //@ts-ignore
            const memJoinData = fetch.data.member?.guildJoins ?? 0;
            //@ts-ignore
            const memLeaveData = fetch.data.member?.guildLeaves ?? 0;

            return await interaction.editReply({
              content: codeBlock(
                "css",
                `
              = = = Server Data = = =
              [Message Size] = ${msgData}
              [Member Join Size] = ${memJoinData}
              [Member Leave Size] = ${memLeaveData}
              [Voice Channels Joined] = ${voiceData}
              [Channels Create] = ${chanCreateData}
              [Channels Delete] = ${chanDeleteData}
   
              More stats coming soon...
   
              Total data size Cached = ${msgData! + memData + voiceData + chanCreateData + chanDeleteData}
               `
              ),
            });
          }
        });
      });
  }
  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: ENV.bot.test_guild_id,
      registerCommandIfMissing: ENV.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: ["966100577790607460"],
    });
  }
}
