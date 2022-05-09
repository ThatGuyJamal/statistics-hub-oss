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

import { container } from "@sapphire/framework";
import { seconds, minutes } from "./time";

/**
 * Pauses execution of a function for a duration of time.
 * @param time Amount of time you with the thread to pause.
 * @param type Seconds or Minutes.
 * @param name The name of the function that executed this promise. Defaults to "PauseThread".
 * @param log Whether or not to log the pause. Defaults to false.
 * @returns {Promise<unknown>}
 */
export const pauseThread = (time: number, type?: "seconds" | "minutes", name?: string, log = false) => {
  let duration: number;
  let logName: string | undefined = name;
  if (!logName) logName = "PauseThread";
  switch (type) {
    case "seconds":
      duration = seconds(time);
      return new Promise((resolve) => setTimeout(resolve))
        .then(() => {
          if (log) container.logger.info(`[${logName}] slept for ${duration} seconds!`);
        })
        .catch((err) => container.logger.error(err));
    case "minutes":
      return new Promise((resolve) => setTimeout(resolve, minutes(time)))
        .then(() => {
          if (log) container.logger.info(`[${logName}] slept for ${duration} minutes!`);
        })
        .catch((err) => container.logger.error(err));
    default:
      return new Promise((resolve) => setTimeout(resolve, seconds(3)))
        .then(() => {
          if (log) container.logger.info(`[${logName}] slept for ${duration} seconds!`);
        })
        .catch((err) => container.logger.error(err));
  }
};
