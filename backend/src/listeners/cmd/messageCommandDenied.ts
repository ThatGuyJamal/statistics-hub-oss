import { MessageCommandDeniedPayload, Events, Listener, UserError } from "@sapphire/framework";
import { seconds } from "../../internal/functions/time";
import { sendLegacyError } from "../../internal/interactions/responses";

export class CommandDenied extends Listener<typeof Events.MessageCommandDenied> {
  public async run({ context, message: content }: UserError, { message }: MessageCommandDeniedPayload) {
    if (Reflect.get(Object(context), "silent")) return;

    try {
      const sent = await sendLegacyError(message, content);
      
      setTimeout(async() => await sent.delete().catch(() => {}), seconds(6))

    } catch (err) {
      this.container.logger.error(err);
    }
  }
}
