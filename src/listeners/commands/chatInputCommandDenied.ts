import { Listener, Events, UserError, ChatInputCommandDeniedPayload } from "@sapphire/framework";
import { sendError } from "../../lib/utils/responses";

export class UserListener extends Listener<typeof Events.ChatInputCommandDenied> {
  public run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    try {
      if (Reflect.get(Object(error.context), "silent")) return;

      return sendError(interaction, error.message);
    } catch (err) {
      return this.container.logger.error(err);
    }
  }
}
