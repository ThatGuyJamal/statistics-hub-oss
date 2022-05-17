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
import { Args, BucketScope } from "@sapphire/framework";
import { Message } from "discord.js";
import { ICommandOptions, ICommand } from "../../Command";
import { seconds } from "../../internal/functions/time"
import { fetch, FetchResultTypes } from '@sapphire/fetch';
import { environment } from "../../config";

const errorTracked = [];

@ApplyOptions<ICommandOptions>({
  description: "Test command for some stuff :/",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    hidden: true,
  },
})
export class UserCommand extends ICommand {
  public async messageRun(ctx: Message, args: Args) {
    const { client } = this.container;
    await ctx.channel.send({ content: `Starting test...` });
    try {
      await this.testCode(ctx, args);
    } catch (e) {
      errorTracked.push(1);
      client.logger.error(e);
      await ctx.channel.send({
        embeds: [
          {
            description: `Error: ${e}`,
          },
        ],
      });
    }
    await ctx.channel.send({
      content: `Test finished! ${
        errorTracked.length > 0
          ? `${errorTracked.length} errors were tracked. Check the logs...`
          : ""
      }`,
    });
  }

  /**
   * The test code to run
   * @param ctx
   */
  private async testCode(ctx: Message, _args: Args) {
    /**
     * @test Fetch API
     * @date 2022-05-17
     */

    const data = await fetch<JsonPlaceholderResponse>(`${environment.bot.bot_dashboard_api_url}/ping`, FetchResultTypes.JSON)

    if (data.status !== 200) {
      return await ctx.channel.send(`Error: ${data.status}`);
    }

    return await ctx.channel.send(`Response from the API: ${data.response} (Status: ${data.status})`);
  }
}

interface JsonPlaceholderResponse {
  response: string;
  status: number;
}