import { Collection } from "discord.js";
import { ENV } from "../../../config";
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
   * Starts an interval
   * @param name
   * @param callback
   * @param interval
   */
  public async start(name: string, callback: () => void, interval: number): Promise<void> {
    try {
      if (this.intervals.has(name)) {
        if (this.exists(name)) {
          try {
            await this.stop(name);
          } catch (error) {
            this.client.logger.error(error);
          }
        }
      }
      this.intervals.set(name, setInterval(callback, interval));
      if (ENV.bot.dev) {
        this.client.logger.info(`[Interval] ${name} started with interval ${interval}ms`);
      }
    } catch (e) {
      this.client.logger.error(e);
    }
  }

  /**
   * Stops an interval
   * @param name
   * @returns {Promise<void>}
   */
  public async stop(name: string): Promise<void> {
    if (this.intervals.has(name)) {
      this.intervals.delete(name);
      if (ENV.bot.dev) {
        this.client.logger.info(`[Interval] ${name} has stopped`);
      }
    } else {
      if (ENV.bot.dev) {
        this.client.logger.info(`[Interval] ${name} does not exist`);
      }
    }
  }

  /**
   * Check if an interval exists
   * @param name
   * @returns {boolean}
   */
  public exists(name: string): boolean {
    if (ENV.bot.dev) {
      this.client.logger.info(`[Interval] ${name} exists? ${this.intervals.has(name)}`);
    }
    return this.intervals.has(name);
  }
}
