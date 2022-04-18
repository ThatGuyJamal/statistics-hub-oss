import { Listener, Events, ChatInputCommandErrorPayload, UserError } from "@sapphire/framework";
import { TextChannel } from "discord.js";
import { ENV } from "../../config";
import { bold, redBright } from "colorette";
import { translate } from "../../lib/il8n/translate";
import { BaseEmbed } from "../../lib/utils/embed";
import { sendError } from "../../lib/utils/responses";

export class UserListener extends Listener<typeof Events.ChatInputCommandError> {
  public async run(error: Error, { command, interaction }: ChatInputCommandErrorPayload) {
    if (error instanceof UserError) {
      return sendError(interaction, error.message);
    }

    this.container.logger.fatal(`${redBright(bold(`[/${command.name}]`))} ${error.stack || error.message}`);

    let logChannel = this.container.client.channels.cache.get(ENV.logger.command_channel) as TextChannel;
    if (logChannel) {
      await logChannel.send({
        content: `${redBright(bold(`[/${command.name}]`))} ${error.stack || error.message}`,
        embeds: [
          new BaseEmbed().interactionEmbed(
            {
              title: await translate(
                interaction.channel as TextChannel,
                "events/errors:command_input_error_event_embed_titles"
              ),
              description: await translate(
                interaction.channel as TextChannel,
                "events/errors:command_input_error_event_embed_descriptions"
              ),
              fields: [
                {
                  name: "Command",
                  value: `${command.name}`,
                  inline: true,
                },
                {
                  name: "Error",
                  value: `${error.stack || error.message}`,
                  inline: true,
                },
              ],
              color: "RED",
            },
            interaction
          ),
        ],
      });
    }

    return sendError(interaction, "Something went wrong");
  }
}
