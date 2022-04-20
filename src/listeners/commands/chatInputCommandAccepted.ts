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

import { Listener, Events, ChatInputCommandAcceptedPayload } from "@sapphire/framework";

export class UserListener extends Listener<typeof Events.ChatInputCommandAccepted> {
  public async run({ command, interaction }: ChatInputCommandAcceptedPayload) {
    // Update statistics every time a command is run. The user ID is
    // submitted, so we can identify the number of unique users using the
    // bot.

    this.container.statcord.postCommand(command.name, interaction.user.id);
  }
}
