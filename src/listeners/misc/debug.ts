import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({
  event: Events.Debug,
})
export class UserEvent extends Listener {
  public run(_bug: string) {
    // if (this.container.client.environment.bot.dev === true) {
    //    return this.container.logger.info(bug);
    // } else {
    //    return null;
    // }
  }
}
