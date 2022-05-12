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
import { ListenerOptions, Events, Listener, UserError, MessageCommandErrorPayload } from "@sapphire/framework";
import { send } from "@sapphire/plugin-editable-commands";

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCommandError,
})
export class UserListener extends Listener<typeof Events.MessageCommandError> {
  public override async run(error: UserError, { message }: MessageCommandErrorPayload) {
    if (error instanceof UserError) {
      if (!Reflect.get(Object(error.context), "silent"))
        return send(message, {
          content: error.message,
        });
    }
    return undefined;
  }
}
