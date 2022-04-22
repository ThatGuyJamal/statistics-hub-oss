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
import { TextChannel } from "discord.js";
import { ENV } from "../../config";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { codeBlock } from "../../lib/utils/format";
import { seconds } from "../../lib/utils/time";

@ApplyOptions<ICommandOptions>({
  description: "Manage or view statistics",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "[sub-command] <options>",
    examples: ["statistics view all", "statistics download"],
  },
  preconditions: ["development"],
})
export class UserCommand extends ICommand {
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    return await interaction.reply({
      content: codeBlock("diff", 
      `
      - ${await this.translate(interaction.channel as TextChannel, "commands/core:statistics.success")}
      `
      ),
    });
  }
  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
      guildIds: ENV.bot.test_guild_id,
      registerCommandIfMissing: ENV.bot.register_commands,
      behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      idHints: ["966095079506845726"],
    });
  }
}

/**
 * * Planned sub commands:
 *  view - view the current statistics
 *  wipe - delete them
 *  download - Send a text doc with all the stats collected
 *
 */
