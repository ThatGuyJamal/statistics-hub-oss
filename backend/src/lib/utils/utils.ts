import { container } from "@sapphire/framework";
import { ENV } from "../../config";

const testGuilds = ENV.bot.test_guild_id;

/**
 * A more programmatic way to get all development guilds for the bot.
 * @returns {string[]}
 */
export function getTestGuilds(): string[] {
  const arr: string[] = [];

  for (const guild of testGuilds) {
    arr.push(guild);
  }

  return arr;
}
