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

import { Listener, Events, MessageCommandAcceptedPayload } from "@sapphire/framework";
import { bold, cyan } from "colorette";

export class UserListener extends Listener<typeof Events.MessageCommandSuccess> {
  public override run({ message, command }: MessageCommandAcceptedPayload) {
    const msg = `${cyan(bold(`[/${command.name}]`))} - Command executed by ${message.author.tag} (${
      message.author.id
    })`;

    this.container.logger.debug(msg);
  }
}
