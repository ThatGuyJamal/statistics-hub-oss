import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions, Events, Listener, MessageCommandAcceptedPayload } from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCommandAccepted,
})
export class UserEvent extends Listener {
  public async run(payload: MessageCommandAcceptedPayload) {
    let author = payload.message.author;

    this.container.statcord.postCommand(payload.command.name, author.id);
  }
}
