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

import { Collection } from "discord.js";
import { BotClient } from "../../client/bot";

/**
 * Util class for creating intervals and clearing them.
 * @class IntervalController
 */
export class IntervalsController {
  protected ready: boolean;
  private intervals: Collection<string, NodeJS.Timeout>;
  private client: typeof BotClient;
  public constructor(instanceOfClient: typeof BotClient) {
    this.ready = false;
    this.client = instanceOfClient;
    this.intervals = new Collection<string, NodeJS.Timeout>();
  }

  public async init(): Promise<void> {
    this.ready = true;
  }

  /**
   * Starts an interval and provides a little bit of safety to make sure it doesn't start twice.
   * @param name Name of the interval
   * @param callback The callback to be called
   * @param interval The interval to be called
   */
  public async start(name: string, callback: () => any, interval: number): Promise<any> {
    try {
      if (this.intervals.has(name)) {
        if (this.exists(name)) {
          try {
            await this.stop(name);
          } catch (error) {
            this.client.logger.error(error);
          }
        }
      } else {
        this.intervals.set(name, setInterval(callback, interval));
      }
    } catch (e) {
      this.client.logger.error(e);
    }
  }

  /**
   * Stops an interval
   * @param name Name of the interval
   * @returns {Promise<void>} Whether the interval exists
   */
  public async stop(name: string): Promise<void> {
    if (this.intervals.has(name)) {
      this.intervals.delete(name);
        this.client.logger.info(`[Interval] ${name} has stopped`);
    } else {
        this.client.logger.info(`[Interval] ${name} does not exist, nothing was stopped`);
    }
  }

  /**
   * Check if an interval exists
   * @param name Name of the interval
   * @returns {boolean} Whether the interval exists
   */
  public exists(name: string): boolean {
    return this.intervals.has(name);
  }
}
