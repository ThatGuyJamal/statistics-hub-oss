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
import Redis from "ioredis";
import { environment } from "../config";
import { seconds, hours } from "../internal/functions/time";

/**
 * @export
 * @class RedisController
 * @extends {Redis}
 */
export class RedisController {
  /**
   * The redis client.
   */
  public client: Redis | undefined;
  public readonly config;

  public constructor(options: { enabled: boolean }) {
    this.config = options;
    if (options.enabled) {
      this.client = new Redis({
        port: environment.db.redis.port,
        // host: environment.db.redis.host,
        // username: environment.db.redis.username,
        // password: environment.db.redis.password,
        autoResubscribe: true,
        commandTimeout: seconds(120),
      });
    } else {
      container.logger.warn("Redis is not enabled!");
    }
  }

  /**
   * Get a value from redis.
   * @param key The key to get.
   * @returns {Promise<string | null>} The value or null if not found.
   */
  public async get(key: string): Promise<string | null> {
    if (!this.client) throw new Error("Redis is not enabled!");
    return this.client.get(key, function (err, result) {
      if (err) {
        container.logger.error(err);
        return null;
      } else {
        return result;
      }
    });
  }

  /**
   * Set a value in redis.
   * @param key The key to set.
   * @param value The value to set.
   * @param expire The expire time in seconds. Defaults to 1 hour.
   * @returns {Promise<string | null>} The value or null if not found.
   */
  public async set(key: string, value: string, expire?: number): Promise<string | null> {
    if (!this.client) throw new Error("Redis is not enabled!");
    if (!expire) expire = hours(1);
    return this.client.set(key, value, "EX", expire);
  }

  /**
   * Delete a value from redis.
   * @param key The key to delete.
   * @returns {Promise<boolean>} Whether the key was deleted or not.
   */
  public async del(key: string): Promise<boolean> {
    if (!this.client) throw new Error("Redis is not enabled!");
    try {
      await this.client.del(key);
      return true;
    } catch (e) {
      container.logger.error(e);
      return false;
    }
  }

  /**
   * Check if a key exists in redis.
   * @param key The key to check.
   * @returns {Promise<boolean>} Whether the key exists or not.
   */
  public async exists(key: string): Promise<boolean> {
    if (!this.client) throw new Error("Redis is not enabled!");
    try {
      await this.client.exists(key);

      return true;
    } catch (e) {
      container.logger.error(e);
      return false;
    }
  }
}
