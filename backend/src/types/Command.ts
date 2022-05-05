import type { BotClientType } from "../Client";
import type { ApplicationCommandOption, ApplicationCommandTypes, Interaction } from "../deps";

export interface SlashCommand {
  path(path: any): string;
  /** The name of this command. */
  name: string;
  /** What does this command do? */
  description: string;
  /** The type of command this is. */
  type: ApplicationCommandTypes;
  /** Whether or not this command is for the dev server only. */
  devOnly?: boolean;
  /** The options for this command */
  options?: ApplicationCommandOption[];
  /** This will be executed when the command is run. */
  execute: (bot: BotClientType, interaction: Interaction) => unknown;
}
