import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerErrorPayload, ListenerOptions } from "@sapphire/framework";
import type { RateLimitData } from "discord.js";
import { bold, redBright } from "colorette";

@ApplyOptions<ListenerOptions>({
  event: Events.ListenerError,
})
export class UserEvent extends Listener {
  public async run(error: Error, payload: ListenerErrorPayload): Promise<void> {
    this.container.logger.error(error, payload);
  }
}

@ApplyOptions<ListenerOptions>({
  event: Events.Error,
})
export class UserEvent2 extends Listener {
  public async run(error: Error, payload: ListenerErrorPayload): Promise<void> {
    this.container.logger.error(error, payload);
  }
}

@ApplyOptions<ListenerOptions>({
  event: Events.RateLimit,
})
export class UserEvent3 extends Listener {
  public async run(limit: RateLimitData): Promise<void> {
    try {
      await this.container.client.logger.fatal(`RATE LIMITED:\n\n${JSON.stringify(limit, null, 4)}`);
    } catch (err) {
      return this.container.client.logger.error(err);
    }
  }
}

export class UserEvent4 extends Listener<typeof Events.ListenerError> {
  public run(error: Error, { piece }: ListenerErrorPayload) {
    this.container.logger.fatal(`${redBright(bold(`[/${piece.name}]`))} ${error.stack || error.message}`);
  }
}
