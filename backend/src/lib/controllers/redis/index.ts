import { container } from "@sapphire/framework";
import Redis from "ioredis";
import { ENV } from "../../../config";
import { hours, seconds } from "../../utils/time";

/**
 * @export
 * @class RedisController
 * @extends {Redis}
 */
export class RedisController {
  /**
   * The redis client.
   */
  public client: Redis;

  public constructor() {
    this.client = new Redis({
      // port: ENV.database.redis.port,
      // host: ENV.database.redis.host,
      // username: ENV.database.redis.username,
      // password: ENV.database.redis.password,
      // autoResubscribe: true,
      // commandTimeout: seconds(30),
    });
  }

  /**
   * Get a value from redis.
   * @param key The key to get.
   * @returns {Promise<string | null>} The value or null if not found.
   */
  public async get(key: string): Promise<string | null> {
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
    if (!expire) expire = hours(1);
    return this.client.set(key, value, "EX", expire);
  }

  /**
   * Delete a value from redis.
   * @param key The key to delete.
   * @returns {Promise<boolean>} Whether the key was deleted or not.
   */
  public async del(key: string): Promise<boolean> {
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
    try {
      await this.client.exists(key);

      return true;
    } catch (e) {
      container.logger.error(e);
      return false;
    }
  }
}
