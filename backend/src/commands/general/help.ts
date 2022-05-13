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
import {
  BucketScope,
  ApplicationCommandRegistry,
  RegisterBehavior,
  ChatInputCommand,
  Args,
} from "@sapphire/framework";
import { Message} from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { environment } from "../../config";
import { seconds } from "../../internal/functions/time";
import { getTestGuilds } from "../../internal/load-test-guilds";

@ApplyOptions<ICommandOptions>({
  name: "help",
  description: "Shows information about the commands and how to use them.",
  aliases: ["h", "commands", "cmds"],
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "help <command name>",
    examples: ["help ping", "help prefix"],
    command_type: "both",
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, _args: Args) {
   return ctx.reply("Coming soon...");
  }

  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    return interaction.reply("Coming soon...");
  }

  /**
   * Resolves a command by name.
   * @param providedCommand The command name to resolve.
   * @private
   */
  private async __resolveCommand(providedCommand: string): Promise<ICommand | undefined> {
    const command = this.container.stores.get("commands").get(providedCommand.toLowerCase()) as ICommand | undefined;

    return command === undefined ? undefined : command;
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((options) =>
            options
              .setName("name")
              .setDescription("The name of the command you wish to learn more about.")
              .setRequired(false)
          ),
      {
        guildIds: getTestGuilds(),
        registerCommandIfMissing: environment.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
        idHints: ["97360358034076473"],
      }
    );
  }
}
