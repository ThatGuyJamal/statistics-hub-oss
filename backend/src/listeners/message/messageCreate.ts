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
import { ListenerOptions, Events, Listener, container } from "@sapphire/framework";
import { Message } from "discord.js";
import { DefaultGuildDataModelObject } from "../../lib/database/";
import { isGuildMessage } from "../../lib/utils/guards";
import { minutes } from "../../lib/utils/time";

const ratelimit = new Map<
  string,
  {
    /** The value of the new cache */
    value: number;
    /** Ratelimit stack increment */
    stack: number;
  }
>();

// clear the ratelimit every 5 minutes for all guilds
container.client.IntervalsController.start(
  "messageCreate-interval-queue",
  () => {
    ratelimit.clear();
  },
  minutes(10)
);

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate,
})
export class UserEvent extends Listener {
  public async run(ctx: Message) {
    if (ctx.partial || !isGuildMessage(ctx) || ctx.author.bot) return;

    let result = ratelimit.get(ctx.guild.id);
    if (!result) result = { value: 0, stack: 0 };

    if (ratelimit.has(ctx.guild.id)) {
      if (result.stack > 5) {
        // container.logger.info(`Ratelimit exceeded for ${ctx.guild.name} | ${ctx.guild.id} - Pushing to upload queue...`);
        this.upload(ctx);
      } else {
        // container.logger.info(`[Ratelimit] ${ctx.guild.name} | ${ctx.guild.id} - Incrementing stack...`);
        ratelimit.set(ctx.guild.id, {
          value: result.value + 1,
          stack: result.stack + 1,
        });
      }
    } else {
      // container.logger.info(`[Ratelimit] ${ctx.guild.name} | ${ctx.guild.id} - Initializing...`);
      ratelimit.set(ctx.guild.id, {
        value: 1,
        stack: 0,
      });
    }
  }

  /**
   * Update the db with the new cache
   * @param ctx
   * @returns
   */
  private async upload(ctx: Message) {
    if (!isGuildMessage(ctx)) return;

    const fetch = await this.container.client.GuildSettingsModel.getDocument(ctx.guild);

    if (!fetch) {
      await this.container.client.GuildSettingsModel._model
        .create({
          _id: ctx.guild.id,
          guild_name: ctx.guild.name,
          data: DefaultGuildDataModelObject,
        })
        .then((res) => {
          this.container.logger.info(res);
          ratelimit.delete(ctx.guild.id);
        });
    } else {
      let result = ratelimit.get(ctx.guild.id);
      await this.container.client.GuildSettingsModel._model
        .updateOne(
          {
            _id: ctx.guild.id,
          },
          {
            $inc: {
              "data.message": result?.value ?? 1,
            },
            $set: {
              guild_name: ctx.guild.name,
            },
          }
        )
        .then((res) => {
          this.container.logger.info(res);
          ratelimit.delete(ctx.guild.id);
        });
    }
  }
}
