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

import { Command as SapphireCommand, type Args, type Piece, UserError } from "@sapphire/framework";
import { PermissionFlagsBits } from "discord-api-types/v9";
import { Permissions, TextChannel } from "discord.js";
import { TOptions } from "i18next";
import { SubCommandPluginCommandOptions } from "@sapphire/plugin-subcommands";
import { ENV } from "../../config";
import { fetchCurrentLanguage, translate } from "../il8n/translate";
import { GuildMessage } from "../../types/discord";

/**
 * The base class for all commands. Extends @SapphireCommand to add more functionally for our bot
 */
export abstract class ICommand extends SapphireCommand<Args, ICommandOptions> {
  /**
   * @description The extended description.
   * @type {ICommandExtendedDescription}
   */
  extendedDescription: ICommandExtendedDescription | undefined;

  /**
   * Options for command configuration.
   * @param context The context of the command.
   * @param options The options for the command.
   */
  public constructor(context: Piece.Context, options: ICommandOptions) {
    super(context, {
      ...options,
      // Base permissions for all commands
      requiredClientPermissions: new Permissions(options.requiredClientPermissions).add([
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.UseApplicationCommands,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.AttachFiles,
      ]),
      generateDashLessAliases: true,
      runIn: ["GUILD_TEXT"],
    });

    this.extendedDescription = options.extendedDescription;

    // If this command is owner only:
    if (this.category === "developer") {
      // Enable it only if there is a development server on the assumption
      // it would've been registered guild wide otherwise.
      this.enabled &&= Boolean(ENV.bot.test_guild_id);

      // Automatically enable the OwnerOnly precondition.
      this.preconditions.append("OwnerOnly");
    }

    // If this command is disabled:
    if (this.category === "disabled") {
      // Disable it.
      this.enabled = false;
    }
  }
  public onLoad() {
    this.container.logger.debug(`[COMMAND]`, `Loaded ${this.name}.`);
  }

  public onUnload() {
    this.container.logger.debug(`[COMMAND]`, `Unloaded ${this.name}.`);
  }

  /**
   * Customized function to translate objects in our bot
   * @param x The TextChannel instance
   * @param path of the key to translate
   * @param _options from i18next to pass to the translation function
   */
  public async translate(x: TextChannel, path: string, _options?: TOptions): Promise<string> {
    return await translate(x, path, _options);
  }

  /**
   * Returns the current language of the guild
   * @param x
   */
  public async fetchLanguage(x: TextChannel | GuildMessage): Promise<string> {
    return await fetchCurrentLanguage(x);
  }

  protected error(identifier: string | UserError, context?: unknown): never {
    throw typeof identifier === "string" ? new UserError({ identifier, context }) : identifier;
  }
}

export interface ICommandExtendedDescription {
  usage?: string;
  examples?: string[];
  command_type?: command_type;
}

/**
 * @description The Yoru command options interface.
 * @typedef {Object} ICommandOptions
 * @extends SubCommandPluginCommandOptions
 */
export interface ICommandOptions extends SubCommandPluginCommandOptions {
  description?: string;
  extendedDescription?: ICommandExtendedDescription | undefined;
}

type command_type = "slash" | "message" | "both";
