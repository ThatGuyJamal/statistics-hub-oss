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
import { DefaultDataModelObject } from "../../lib/database/guild/model";

@ApplyOptions<ICommandOptions>({
  description: "Checks the current active cache for this server",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  preconditions: ["OwnerOnly"],
})
export class UserCommand extends ICommand {
  // Message Based Command
  public async messageRun(ctx: Message) {
    ctx.channel.send("This command is not available in this context. Please use slash commands.").then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, seconds(7));
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
              fetch.data.member?.guildJoins + fetch.data.member?.guildLeaves + fetch.data.member?.guildBans;
            //@ts-ignore
            const msgData = fetch.data.message;
            //@ts-ignore
            const voiceData = fetch.data.voice;
            //@ts-ignore
            const chanData = fetch.data.channel?.created + fetch.data.channel?.deleted;

            return await interaction.editReply({
              content: codeBlock(
                "css",
                `
               Server Data
               [Message Size] = ${fetch?.data?.message ?? 0}
               [Member Size]  = ${memData ?? 0}
               [Voice Size]   = ${voiceData ?? 0}
               [Channel Size] = ${chanData ?? 0}
   
               More stats coming soon...
   
               Total data size Cached = ${msgData! + memData}
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
