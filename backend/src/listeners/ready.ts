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
import { ListenerOptions, Events, Listener, Store } from "@sapphire/framework";
import { Message } from "discord.js";
import { ENV } from "../config";
import { blue, bold, gray, green, magenta, magentaBright, white, yellow } from "colorette";
import { blackListLevel } from "../lib/controllers/statistics/logger";

const dev = ENV.bot.dev;

@ApplyOptions<ListenerOptions>({
  event: Events.ClientReady,
})
export class UserEvent extends Listener {
  private readonly style = dev ? yellow : blue;

  public async run(_ctx: Message): Promise<void> {
    const { client } = this.container;

    await client.user?.setPresence({
      activities: [
        {
          name: "/commands",
          type: "WATCHING",
        },
      ],
    });

    /**
     * Useful for purging all commands globally on the bot.
     */
    // client.application?.commands.set([])

    // let commands = await client.application!.commands;
    // this.container.logger.trace(commands);

    this.container.logger.info(
      `${client.user?.tag} is online and ready to battle in ${client.guilds.cache.size} guilds!`
    );

    UserEvent.printBanner();
    this.printStoreDebugInformation();
    // await this.guildValidator(ctx);

    this.container.client.StatisticsHandler.init();
  }

  private static printBanner() {
    const success = green("+");

    const llc = dev ? magentaBright : white;
    const blc = dev ? magenta : blue;

    const line01 = llc("");
    const line02 = llc("");
    const line03 = llc("");

    // Offset Pad
    const pad = " ".repeat(7);

    console.log(
      String.raw`
${line01} ${pad}${blc("1.0.0")}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc("<")}${llc("/")}${blc(">")} ${llc("DEVELOPMENT MODE")}` : ""}
		`.trim()
    );
  }

  private printStoreDebugInformation() {
    const { client, logger } = this.container;
    const stores = [...client.stores.values()];
    const last = stores.pop()!;

    for (const store of stores) logger.info(this.styleStore(store, false));
    logger.info(this.styleStore(last, true));
  }

  private styleStore(store: Store<any>, last: boolean) {
    return gray(`${last ? "└─" : "├─"} Loaded ${this.style(store.size.toString().padEnd(3, " "))} ${store.name}.`);
  }

  // private async guildValidator(ctx: Message) {
  //   const { client, logger } = this.container;

  //   // Find all the guilds in our database
  //   const documents = await client.GuildSettingsModel.initCache();

  //   if (!documents) return;

  //   logger.info("Starting guild validator...")

  //   for (const collection of client.guilds.cache) {
  //     const guild = collection[1];

  //     let guilds = documents.find((doc) => doc._id === guild.id);

  //     logger.info(`${this.style(guild.name)} (${guild.id}) - ${guilds ? "Found" : "Not found"} in database.`);

  //     // check if the guild is blacklisted in our database
  //     // if it is, leave the guild
  //     if (guilds && guilds.blacklisted === true) {
  //       await guild.leave();
  //       let msg = `Guild ${bold(guild.name)} (${guild.id}) is on the guild blacklist, leaving...`;
  //       logger.warn(msg);
  //       await client.EventLogger.blackListLogs(ctx, blackListLevel.guild, msg);
  //     }
  //   }
  //   logger.info(`Finished guild validator.`);
  // }
}
