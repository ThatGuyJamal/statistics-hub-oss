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

import { Precondition } from "@sapphire/framework";
import { CommandInteraction, Message } from "discord.js";

export class UserPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!this.container.client.BotDevelopers.has(interaction.user.id)) {
      return this.error({
        message: "This command can only be used by the bot developers.",
      });
    } else {
      return this.ok();
    }
  }

  public override async messageRun(ctx: Message) {
    if (!this.container.client.BotDevelopers.has(ctx.author.id)) {
      return this.error({
        message: "This command can only be used by the bot developers.",
      });
    } else {
      return this.ok();
    }
  }
}
