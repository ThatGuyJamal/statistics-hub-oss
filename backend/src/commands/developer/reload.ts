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
import {
  BucketScope,
  RegisterBehavior,
  ChatInputCommand,
  Piece,
  ApplicationCommandRegistry,
  Store,
} from "@sapphire/framework";
import { Collection, AutocompleteInteraction } from "discord.js";
import { ENV } from "../../config";
import Fuse from "fuse.js/dist/fuse.basic.min.js";
import { Stopwatch } from "@sapphire/stopwatch";
import { ICommandOptions, ICommand } from "../../lib/client/command";
import { BaseEmbed } from "../../lib/utils/embed";
import { seconds } from "../../lib/utils/time";
import { getTestGuilds } from "../../lib/utils/utils";

@ApplyOptions<ICommandOptions>({
  description: "Reload a command, listener, or piece.",
  cooldownDelay: seconds(10),
  cooldownScope: BucketScope.User,
  cooldownLimit: 2,
  runIn: "GUILD_TEXT",
  nsfw: false,
  enabled: true,
  extendedDescription: {
    usage: "[piece | listener | all]",
    examples: ["reload all"],
    command_type: "slash",
  },
  chatInputCommand: {
    register: ENV.bot.register_commands,
    guildIds: ENV.bot.test_guild_id,
    behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
    idHints: ["964166785236615258"],
  },
  preconditions: ["OwnerOnly"],
})
export class UserCommand extends ICommand {
  // Slash Based Command
  public override async chatInputRun(...[interaction]: Parameters<ChatInputCommand["chatInputRun"]>) {
    const type = interaction.options.getSubcommand(true);
    const name = interaction.options.getString("name", true);

    const timer = new Stopwatch().stop();

    if (type === "piece") {
      const pieces = new Collection<string, Piece>().concat(
        // @ts-ignore
        ...this.container.stores.values()
      );
      const piece = pieces.get(name)!;

      timer.start();
      await piece.reload();
    } else if (type === "store") {
      const store = this.container.stores.get(
        // @ts-ignore
        name as keyof Store.RegistryEntries
      )!;

      timer.start();
      await store.loadAll();
    } else {
      timer.start();
      await Promise.all(this.container.stores.map((store) => store.loadAll())).catch((err) => {
        this.container.logger.error(err);
      });
    }

    await interaction.reply({
      embeds: [
        new BaseEmbed().interactionEmbed(
          {
            description: `Reload completed in ${timer.stop().toString()} ⏱️`,
            color: "GREEN",
          },
          interaction
        ),
      ],
      ephemeral: true,
    });
  }
  public override autocompleteRun(interaction: AutocompleteInteraction) {
    const type = interaction.options.getSubcommand(true);
    const query = interaction.options.getFocused() as string;

    const options =
      type === "piece"
        ? new Collection<string, Piece>()
            // @ts-ignore
            .concat(...this.container.stores.values())
            // Don't include builtin pieces
            .filter((piece) => !piece.location.full.includes("node_modules"))
        : this.container.stores;

    if (!query) {
      return interaction.respond(
        [...options.values()].map((item) => ({
          name: `${item.name}${item instanceof Piece ? ` (${item.store.name})` : ""}`,
          value: item.name,
        }))
      );
    }

    const fuzzerSearcher = new Fuse([...options.values()], { keys: ["name"] });
    const results = fuzzerSearcher.search(query.toLowerCase(), { limit: 25 });

    return interaction.respond(
      results.map(({ item }) => ({
        name: `${item.name}${item instanceof Piece ? ` (${item.store.name})` : ""}`,
        value: item.name,
      }))
    );
  }

  // slash command registry
  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription("Reload a piece, or a store, or all of both!")
          .addSubcommand((builder) =>
            builder
              .setName("piece")
              .setDescription("Reload a piece")
              .addStringOption((builder) =>
                builder //
                  .setName("name")
                  .setDescription("The name of the piece to reload")
                  .setRequired(true)
                  .setAutocomplete(true)
              )
          )
          .addSubcommand((builder) =>
            builder
              .setName("store")
              .setDescription("Reload a store")
              .addStringOption((builder) =>
                builder //
                  .setName("name")
                  .setDescription("The name of the store to reload")
                  .setRequired(true)
                  .setAutocomplete(true)
              )
          )
          .addSubcommand((builder) =>
            builder //
              .setName("all")
              .setDescription("Reload all stores and pieces")
          ),
      {
        guildIds: getTestGuilds(),
        registerCommandIfMissing: ENV.bot.register_commands,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    );
  }
}
