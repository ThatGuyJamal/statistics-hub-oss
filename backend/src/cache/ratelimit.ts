import { RateLimitManager } from "@sapphire/ratelimits";
import { seconds } from "../internal/functions/time";

export class RateLimitAPI {
  /**
   * Manager for custom command ratelimits.
   * The first param is the amount of seconds to wait before the user can use the command again.
   * The second param is the amount of times the user can use the command before getting rate-limited.
   */
  public customCommandLimiter = new RateLimitManager(seconds(7), 1);
}
