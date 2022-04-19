import { container } from "@sapphire/framework";
import { Awaitable, isThenable } from "@sapphire/utilities";
import type { RESTJSONErrorCodes } from "discord-api-types/v9";
import { DiscordAPIError } from "discord.js";
import { minutes, seconds } from "./time";

export async function resolveOnErrorCodes<T>(promise: Promise<T>, ...codes: readonly RESTJSONErrorCodes[]) {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof DiscordAPIError && codes.includes(error.code)) return null;
    throw error;
  }
}

export function floatPromise(promise: Awaitable<unknown>) {
  if (isThenable(promise)) promise.catch((error: Error) => container.logger.fatal(error));
}

/**
 * Pauses execution of a function for a duration of time.
 * @param time Amount of time you with the thread to pause
 * @param type Seconds or Minutes
 * @param name The name of the function that executed this promise
 * @returns {Promise<unknown>}
 */
export const pauseThread = (time: number, type?: "seconds" | "minutes", name?: string) => {
  let duration: number;
  let logName: string | undefined = name;
  if (!logName) logName = "PauseThread";
  switch (type) {
    case "seconds":
      duration = seconds(time);
      return new Promise((resolve) => setTimeout(resolve)).finally(() =>
        container.logger.info(`[${logName}] slept for ${duration} seconds!`)
      );
    case "minutes":
      return new Promise((resolve) => setTimeout(resolve, minutes(time))).finally(() =>
        container.logger.info(`[${logName}] slept for ${duration} minutes!`)
      );
    default:
      return new Promise((resolve) => setTimeout(resolve, seconds(3))).finally(() =>
        container.logger.info(`[${logName}] slept for ${duration} seconds!`)
      );
  }
};
