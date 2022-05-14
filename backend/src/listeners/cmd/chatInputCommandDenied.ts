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

import { Listener, Events, UserError, ChatInputCommandDeniedPayload } from "@sapphire/framework";
import { sendError } from "../../internal/interactions/responses";

export class UserListener extends Listener<typeof Events.ChatInputCommandDenied> {
  public async run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    try {
      if (Reflect.get(Object(error.context), "silent")) return;

      return await sendError(interaction, error.message);
    } catch (err) {
      return this.container.logger.error(err);
    }
  }
}
