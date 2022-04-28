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
import { getTestGuilds } from "../../lib/utils/utils";
    
    @ApplyOptions<ICommandOptions>({
      description: "Configure the welcome system.",
      cooldownDelay: seconds(20),
      cooldownScope: BucketScope.User,
      cooldownLimit: 2,
      runIn: "GUILD_TEXT",
      nsfw: false,
      enabled: true,
      extendedDescription: {
        examples: ["setup <options>"],
        command_type: "both",
      },
    })
    export class UserCommand extends ICommand {
      // Slash Based Command
      public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
          return interaction.reply({
                content: "Not implemented yet.",
          })
      }
      // slash command registry
      public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
          guildIds: getTestGuilds(),
          registerCommandIfMissing: ENV.bot.register_commands,
          behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
          idHints: [],
        });
      }
    }