

import { MessageCommandDeniedPayload, Events, Listener, UserError } from '@sapphire/framework';
import { sendLegacyError } from '../../internal/interactions/responses';

export class CommandDenied extends Listener<typeof Events.MessageCommandDenied> {
    public async run({ context, message: content }: UserError, { message }: MessageCommandDeniedPayload) {
        if (Reflect.get(Object(context), 'silent')) return;

        try {
            await sendLegacyError(message, content);
        } catch (err) {
            this.container.logger.error(err);
        }
    }
}