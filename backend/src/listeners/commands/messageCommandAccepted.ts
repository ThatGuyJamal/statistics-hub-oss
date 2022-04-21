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
import { ListenerOptions, Events, Listener, MessageCommandAcceptedPayload } from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCommandAccepted,
})
export class UserEvent extends Listener {
  public async run(payload: MessageCommandAcceptedPayload) {
    let author = payload.message.author;

    this.container.statcord.postCommand(payload.command.name, author.id);
  }
}
