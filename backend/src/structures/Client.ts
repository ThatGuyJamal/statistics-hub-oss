import { createBot, InteractionResponseTypes } from "discordeno"
import { environment } from "../config"

export const Client = createBot({
    token: environment.bot.token,
    intents: ["Guilds"],
    botId: BigInt("946398697254703174"),
    events: {
        ready(_client, payload) {
            console.log(`Successfully connected Shard ${payload.shardId} to the gateway`);
        },

        async interactionCreate(client, interaction) {
            if (interaction.data?.name === "ping") {
                return await client.helpers.sendInteractionResponse(interaction.id, interaction.token, {
                    type: InteractionResponseTypes.ChannelMessageWithSource,
                    data: { content: "🏓 Pong!" },
                });
            }

            return;
        },
    }
})