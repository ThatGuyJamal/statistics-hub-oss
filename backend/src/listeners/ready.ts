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
import { blue, bold, gray, green, magenta, magentaBright, white, yellow } from "colorette";
import { canaryMode, environment } from "../config";
import { ActivityTypes } from "discord.js/typings/enums";

const dev = environment.bot.enabled;

@ApplyOptions<ListenerOptions>({
  event: Events.ClientReady,
})
export class UserEvent extends Listener {
  private readonly style = dev ? yellow : blue;

  public async run(_ctx: Message): Promise<void> {
    const { client } = this.container;

    await client.user?.setPresence({
      status: canaryMode ? "dnd" : "online",
      activities: [
        {
          name: canaryMode ? "Under Construction 🚧" : environment.bot.readyPresenceMessage,
          type: ActivityTypes.LISTENING,
        },
      ],
    });
    this.initializeFunctions().then(() =>
      this.container.logger.info(
        `${client.user?.tag} is online and ready to battle in ${client.guilds.cache.size} guilds!`
      )
    );
  }

  private async initializeFunctions() {
    this.clearApplicationCommands();
    this.container.client.StatCordHandler.init();
    UserEvent.printBanner();
    this.printStoreDebugInformation();
  }

  private clearApplicationCommands(enabled = false) {
    if (!enabled) return;
    else {
      const { client } = this.container;
      // Loop over each test server and clear the application commands
      for (const id of client.environment.bot.test_guild_ids) {
        client.application?.commands.set([], id).then((res) => {
          if (res) this.container.logger.warn(`Cleared application commands in ${id}`);
        });
      }
      client.logger.fatal("Application commands have been cleared!");
    }
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
}
